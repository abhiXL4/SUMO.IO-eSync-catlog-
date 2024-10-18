import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Add Router imports
import SWCatalog from './components/SWCatalog';
import Sidebar from './components/sidebar';
import UploadPage from './components/UploadSw'; // Import UploadPage

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<SWCatalog />} />
            <Route path="/upload" element={<UploadPage />} /> {/* Add route for UploadPage */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
