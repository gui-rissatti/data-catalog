
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_CATALOG_PATH = path.join(__dirname, '../src/data/catalog.json');
const DEPLOYED_URL = 'https://gui-rissatti.github.io/data-catalog/assets/catalog.json'; // Vite often bundles json, but let's check if we can find it. 
// Actually, `catalog.json` is imported in JS. It might not be a separate file in assets unless configured.
// However, the user wants to see "right data". We should check the HTML for some specific string if JSON isn't exposed.
// Or, better, we can check a known string from the new data on the main page if it renders.

// Strategy:
// 1. Load local catalog.json to get a sample ID or Title that is unique to the new import.
// 2. Fetch the main page HTML.
// 3. Check if that unique string exists in the HTML (assuming static rendering or if we can fetch the JS bundle).
// Wait, this is a SPA (React). The data might be inside a JS bundle.
// A more robust way for a "data-catalog" is to expose a version endpoint or check a specific dynamic value.

// Let's try to verify if we can fetch the `catalog` JSON file if it was in `public` folder? 
// No, it is in `src/data`. Vite bundles it.
// So we have to look for it in the JS bundles or check the rendered UI text.
// Checking text is easier.

async function checkDeployment() {
    try {
        console.log('Loading local data...');
        const localData = JSON.parse(fs.readFileSync(LOCAL_CATALOG_PATH, 'utf-8'));

        // Pick a few random items to check
        const sampleItem = localData[0];
        const sampleTitle = sampleItem.title;
        const sampleId = sampleItem.id;

        console.log(`Looking for Title: "${sampleTitle}" or ID: "${sampleId}"`);
        const targetUrl = process.env.DEPLOY_URL || 'https://gui-rissatti.github.io/data-catalog/';
        console.log(`Target URL: ${targetUrl}`);

        const maxRetries = 20;
        const delayMs = 15000; // 15 seconds

        for (let i = 0; i < maxRetries; i++) {
            console.log(`Attempt ${i + 1}/${maxRetries}: Fetching page...`);
            const response = await fetch(targetUrl);
            const text = await response.text();

            if (text.includes(sampleTitle) || text.includes(sampleId)) {
                console.log('✅ SUCCESS! Found new data in the deployed page.');
                return;
            }

            // Also check if we can find the specific JS bundle that might contain it if it's not pre-rendered (SPA usually empty root)
            // But usually the title might be in the title tag or meta if we had SEO.
            // Since it's a SPA, the initial HTML might be almost empty. 
            // We might need to fetch the assets.

            // Let's try to find .js files in the HTML and fetch them.
            const scriptRegex = /src="\/data-catalog\/assets\/index-([a-zA-Z0-9]+)\.js"/;
            const match = text.match(scriptRegex);
            if (match) {
                const scriptUrl = `https://gui-rissatti.github.io${match[0].split('"')[1]}`;
                console.log(`Found script bundle: ${scriptUrl}. Fetching...`);
                const scriptResponse = await fetch(scriptUrl);
                const scriptText = await scriptResponse.text();
                if (scriptText.includes(sampleId)) {
                    console.log('✅ SUCCESS! Found new data in the application bundle.');
                    return;
                }
            }

            console.log('❌ Data not found yet. Waiting...');
            await new Promise(r => setTimeout(r, delayMs));
        }

        console.error('⚠️ Verification failed after all retries.');
        process.exit(1);

    } catch (error) {
        console.error('Error during verification:', error);
        process.exit(1);
    }
}

checkDeployment();
