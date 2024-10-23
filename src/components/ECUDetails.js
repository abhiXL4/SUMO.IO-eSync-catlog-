import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { getECUDetails } from '../services/apiService'; // Import the service to fetch ECU details
import { FiDownload } from 'react-icons/fi';

const ECUDetails = () => {
  const { ecuName } = useParams(); // Get the ECU name from the URL
  const [ecuDetails, setEcuDetails] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchECUDetails = async () => {
      try {
        const response = await getECUDetails(ecuName); // Fetch ECU details by name
        setEcuDetails(response);
      } catch (error) {
        console.error('Error fetching ECU details:', error);
      }
    };
    fetchECUDetails();
  }, [ecuName]);

  if (!ecuDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">{ecuName} Details</h1>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">SW Name</th>
            <th className="p-2 text-left">SW Size</th>
            <th className="p-2 text-left">CAL Name</th>
            <th className="p-2 text-left">CAL Size</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {ecuDetails.files.map((file, index) => (
            <tr key={index}>
              <td className="p-2">{file.swName}</td>
              <td className="p-2">{file.swSize}</td>
              <td className="p-2">{file.calName}</td>
              <td className="p-2">{file.calSize}</td>
              <td className="p-2 text-center">
                <button className="text-gray-600 hover:text-gray-800 p-1">
                  <FiDownload title="Download" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add a "Back to Catalog" button to return to catalog page */}
      <button 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => navigate('/home-catalog-list')} // Use navigate to change route
      >
        Back to Catalog
      </button>
    </div>
  );
};

export default ECUDetails;
