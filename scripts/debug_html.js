
import fetch from 'node-fetch';

async function dumpHtml() {
    try {
        console.log('Fetching https://gui-rissatti.github.io/data-catalog/');
        const response = await fetch('https://gui-rissatti.github.io/data-catalog/');
        const text = await response.text();
        console.log('--- HTML START ---');
        console.log(text);
        console.log('--- HTML END ---');
    } catch (e) {
        console.error(e);
    }
}
dumpHtml();
