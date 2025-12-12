import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DatasetDetail from './pages/DatasetDetail';

function App() {
  return (
    <BrowserRouter basename="/data-catalog">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dataset/:id" element={<DatasetDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
