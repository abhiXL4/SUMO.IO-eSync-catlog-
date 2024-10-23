import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SWCatalog from './components/SWCatalog'; // Main catalog page (can handle SW, RD, Config)
import Sidebar from './components/sidebar'; // Sidebar navigation component
import UploadPage from './components/UploadSw'; // Upload SW page
import ECUDetails from './components/ECUDetails';

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar /> {/* Sidebar for navigation */}
        <main className="flex-1 bg-gray-100 p-6">
          <Routes>
            {/* Main SWCatalog route */}
            <Route path="/" element={<SWCatalog />} />
            {/* Upload SW page route */}
            <Route path="/upload" element={<UploadPage />} />
            {/* View ECU Details page route */}
            <Route path="/:ecuName" element={<ECUDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
