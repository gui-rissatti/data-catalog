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
    // Group rows by catalog_path (id)
    const tables = {};

    rawRows.forEach(row => {
        // Fallback or explicit fields
        const catalog = row.table_catalog || 'default';
        const schema = row.table_schema || 'default';
        const table = row.table_name || 'unnamed';
        // Use the explicit calculated 'catalog_path' if derived in SQL, else construct it
        const fullPath = row.catalog_path || `${catalog}.${schema}.${table}`;

        if (!tables[fullPath]) {
            // First time seeing this table, initialize it
            let layer = 'Silver'; // Default
            const schemaToCheck = schema.toLowerCase();
            if (schemaToCheck.includes('bronze')) layer = 'Bronze';
            else if (schemaToCheck.includes('gold')) layer = 'Gold';
            else if (schemaToCheck.includes('silver')) layer = 'Silver';
            else if (schemaToCheck.includes('diamond')) layer = 'Diamond';
            else if (schemaToCheck.includes('sandbox')) layer = 'Sandbox';

            const tags = [
                layer.toLowerCase(),
                row.data_source_format?.toLowerCase(),
                row.table_type?.toLowerCase()
            ].filter(Boolean);

            if (row.is_insertable_into === 'YES') tags.push('writable');

            tables[fullPath] = {
                id: fullPath,
                title: (row.title || table).split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                description: row.description || row.comment || 'Sem descrição disponível.',
                category: layer,
                owner: row.owner || row.table_owner || 'Desconhecido',
                layer: layer,
                platform: 'Databricks',
                catalog_path: fullPath,
                location: row.location || row.storage_path || 'Managed',
                table_type: row.table_type,
                data_source_format: row.data_source_format,
                created_at: row.created,
                last_altered: row.last_altered,
                tags: tags,
                schema: [],
                sample_query: `SELECT * FROM ${fullPath} LIMIT 10;`
            };
        }

        // Add column if present
        if (row.column_name) {
            tables[fullPath].schema.push({
                name: row.column_name,
                type: row.column_type || 'STRING',
                description: row.column_description || ''
            });
        }
    });

    return Object.values(tables);
}

const RAW_DATA_DIR = path.join(__dirname, '../src/data/raw_data');
const OUTPUT_PATH = path.join(__dirname, '../src/data/catalog.json');

try {
    // 1. Find the CSV file
    const files = fs.readdirSync(RAW_DATA_DIR);
    const csvFile = files.find(file => file.endsWith('.csv'));

    if (!csvFile) {
        throw new Error(`No CSV file found in ${RAW_DATA_DIR}`);
    }

    const csvPath = path.join(RAW_DATA_DIR, csvFile);
    console.log(`Processing file: ${csvFile}`);

    // 2. Read and Parse
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const rawRows = parseCSV(csvContent);
    console.log(`Parsed ${rawRows.length} rows from CSV.`);

    // 3. Transform
    const catalog = transformToCatalogSchema(rawRows);
    console.log(`Transformed into ${catalog.length} unique datasets/tables.`);

    // 4. Save
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(catalog, null, 2));
    console.log(`Successfully saved catalog to ${OUTPUT_PATH}`);

} catch (error) {
    console.error('Error converting CSV:', error);
    process.exit(1);
}
