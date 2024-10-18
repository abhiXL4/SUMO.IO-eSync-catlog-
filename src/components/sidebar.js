// src/components/Sidebar.js
import React from 'react';
import download from '../assets/download__1_-removebg-preview.png';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">  
     
      <div className="flex items-center justify-center font-bold text-xl mb-6 space-x-3">
        <img src={download} alt="Logo" className="w-12 h-12" /> 
        <div>
          <h1>eSync OTA</h1>
          <p className="text-sm">Powered by Excelfore</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="material-icons">home</span>
          <span>Welcome User</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="material-icons">folder</span>
          <span>Catalogs</span>
        </div>
      </div>
    </div>  
  );
};

export default Sidebar;
