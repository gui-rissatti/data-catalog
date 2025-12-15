import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DatasetDetail from './pages/DatasetDetail';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
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
