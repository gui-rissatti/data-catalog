# Corporate Data Catalog

A Data Catalog designed for GitHub Pages. This project allows you to host a searchable, categorized inventory of your company's data assets (mocked as JSON files) on a static site.

## 🚀 Features

- **Searchable Catalog**: Find datasets by name, description, or tags.
- **Data Preview**: View the first few rows of any dataset directly in the browser.
- **Schema view**: Inspect column names and types.
- **Zero Backend**: Runs entirely on the client-side (fake data is loaded from `/public/data`).

## 🛠 Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Locally**:
   ```bash
   npm run dev
   ```

## 📦 Deployment to GitHub Pages

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

1. Go to **Settings > Pages** in your GitHub repository.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Push your changes to the `main` branch.
4. The `.github/workflows/deploy.yml` workflow will trigger and deploy your site.

## 📝 Adding Data

1. Add your CSV/JSON file to `public/data/`.
2. Update `src/data/catalog.json` with the metadata for your new dataset.

## 🎨 Technology

- React
- Vite
- TailwindCSS
- Lucide Icons
