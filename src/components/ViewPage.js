import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewPage = () => {
  const location = useLocation();
  const { ecuName, containerId } = location.state; // Retrieve passed data (ECU name and container ID)

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/'); // Redirect to Home Catalog List page
  };

  // Placeholder for files data, empty if no files are available
  const files = []; // When no files exist, just leave this empty or fetch it dynamically

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Details</h2>

      {/* ECU Name and Container ID Display */}
      <table className="min-w-full table-auto border-collapse border border-gray-300 mb-4">
        <tbody>
          <tr>
            <td className="p-2 border border-gray-300 font-bold">ECU Name</td>
            <td className="p-2 border border-gray-300">{ecuName}</td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300 font-bold">Container ID</td>
            <td className="p-2 border border-gray-300">{containerId}</td>
          </tr>
        </tbody>
      </table>

      {/* Conditionally Render File List Only If Files Exist */}
      {files.length > 0 && (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-300 text-left">SW Name</th>
              <th className="p-2 border border-gray-300 text-left">SW Size</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-300">{file.fileName}</td>
                <td className="p-2 border border-gray-300">{file.fileSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Download Button */}
      <button className="mt-4 bg-blue-500 text-white p-2 rounded">Download</button>

      <div className="flex justify-end mt-4">
        <button 
            className="bg-green-500 text-white p-2 rounded"
            onClick={handleCancel}
        >
            OK
        </button>
        
      </div>
    </div>
  );
};

export default ViewPage;
