import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '../src/data/raw_data/New_Query_2025_12_14_11_05pm.csv');
const JSON_PATH = path.join(__dirname, '../src/data/catalog.json');

function parseCSV(csvText) {
    const lines = csvText.split(/\r?\n/);
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Simple CSV parser handling quoted fields (Unity Catalog descriptions can be quoted)
        const row = [];
        let currentField = '';
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                if (j + 1 < line.length && line[j + 1] === '"') {
                    currentField += '"';
                    j++; // Skip escaped quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                row.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        row.push(currentField);

        if (row.length === headers.length) {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header.trim()] = row[index]?.trim() || null;
            });
            result.push(obj);
        }
    }
    return result;
}

function transformToCatalogSchema(rawRows) {
    return rawRows.map(row => {
        // Map fields
        const catalog = row.table_catalog || 'default';
        const schema = row.table_schema || 'default';
        const table = row.table_name || 'unnamed';
        const fullPath = `${catalog}.${schema}.${table}`;

        // Determine Layer from Schema (common convention)
        let layer = 'Silver'; // Default
        if (schema.toLowerCase().includes('bronze')) layer = 'Bronze';
        else if (schema.toLowerCase().includes('gold')) layer = 'Gold';
        else if (schema.toLowerCase().includes('silver')) layer = 'Silver';
        else if (schema.toLowerCase().includes('diamond')) layer = 'Diamond'; // Seen in CSV
        else if (schema.toLowerCase().includes('sandbox')) layer = 'Sandbox';

        // Tags
        const tags = [
            layer.toLowerCase(),
            row.data_source_format?.toLowerCase(),
            row.table_type?.toLowerCase()
        ].filter(Boolean);

        if (row.is_insertable_into === 'YES') tags.push('writable');

        return {
            id: fullPath,
            title: table.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            description: row.comment || 'Sem descrição disponível.',
            category: schema.charAt(0).toUpperCase() + schema.slice(1),
            owner: row.table_owner || 'Desconhecido',
            layer: layer,
            platform: 'Databricks',
            catalog_path: fullPath,
            location: row.storage_path || 'Managed',
            // Dynamic extra fields found in CSV
            table_type: row.table_type,
            data_source_format: row.data_source_format,
            created_at: row.created,
            last_altered: row.last_altered,
            // Standard Schema fields
            tags: tags,
            schema: [], // CSV does not contain column info
            sample_query: `SELECT * FROM ${fullPath} LIMIT 10;`
        };
    });
}

try {
    console.log(`Reading CSV from ${CSV_PATH}...`);
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');

    console.log('Parsing CSV...');
    const rawData = parseCSV(csvContent);

    console.log(`Found ${rawData.length} rows. Transforming...`);
    const catalogData = transformToCatalogSchema(rawData);

    console.log(`Writing JSON to ${JSON_PATH}...`);
    fs.writeFileSync(JSON_PATH, JSON.stringify(catalogData, null, 4), 'utf-8');

    console.log('Success! Catalog updated.');
} catch (error) {
    console.error('Error converting CSV:', error);
    process.exit(1);
}
