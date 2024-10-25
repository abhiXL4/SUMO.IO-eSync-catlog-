// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const ViewPage = () => {
//   const location = useLocation();
//   const { ecuName, containerId } = location.state; // Retrieve passed data (ECU name and container ID)

//   const navigate = useNavigate();

//   const handleCancel = () => {
//     navigate('/'); // Redirect to Home Catalog List page
//   };

//   // Placeholder for files data, empty if no files are available
//   const files = []; // When no files exist, just leave this empty or fetch it dynamically

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Details</h2>

//       {/* ECU Name and Container ID Display */}
//       <table className="min-w-full table-auto border-collapse border border-gray-300 mb-4">
//         <tbody>
//           <tr>
//             <td className="p-2 border border-gray-300 font-bold">ECU Name</td>
//             <td className="p-2 border border-gray-300">{ecuName}</td>
//           </tr>
//           <tr>
//             <td className="p-2 border border-gray-300 font-bold">Container ID</td>
//             <td className="p-2 border border-gray-300">{containerId}</td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Conditionally Render File List Only If Files Exist */}
//       {files.length > 0 && (
//         <table className="min-w-full table-auto border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2 border border-gray-300 text-left">SW Name</th>
//               <th className="p-2 border border-gray-300 text-left">SW Size</th>
//             </tr>
//           </thead>
//           <tbody>
//             {files.map((file, index) => (
//               <tr key={index}>
//                 <td className="p-2 border border-gray-300">{file.fileName}</td>
//                 <td className="p-2 border border-gray-300">{file.fileSize}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Download Button */}
//       <button className="mt-4 bg-blue-500 text-white p-2 rounded">Download</button>

//       <div className="flex justify-end mt-4">
//         <button 
//             className="bg-green-500 text-white p-2 rounded"
//             onClick={handleCancel}
//         >
//             OK
//         </button>
        
//       </div>
//     </div>
//   );
// };

// export default ViewPage;



import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewPage = () => {
  const location = useLocation();
  const { ecuName, containerId } = location.state || {}; // Retrieve passed data (ECU name and container ID)
  const navigate = useNavigate();

  const [presignedUrl, setPresignedUrl] = useState(''); // State to hold presigned URL
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [files, setFiles] = useState([]); // Placeholder for files data, can be fetched dynamically

  // Simulate fetching the presigned URL from an API or backend when component mounts
  useEffect(() => {
    const fetchPresignedUrl = async () => {
      try {
        // Replace with actual API call to get the presigned URL
        const url = await fetchPresignedUrlFromAPI();
        setPresignedUrl(url);
      } catch (error) {
        console.error('Error fetching presigned URL:', error);
      } finally {
        setLoading(false); // Set loading to false after the URL is fetched
      }
    };

    fetchPresignedUrl();

    // Simulate fetching file list data (can be replaced with actual API call)
    setFiles([
      { fileName: 'Software_v1.0.bin', fileSize: '1.2 MB' },
      { fileName: 'Software_v2.0.bin', fileSize: '1.5 MB' }
    ]);
  }, []);

  // Simulated API call to fetch presigned URL (replace with your actual API logic)
  const fetchPresignedUrlFromAPI = async () => {
    return 'https://catalogue-manager-test.s3.amazonaws.com/Automotive-SPICE01.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20241025T061611Z&X-Amz-SignedHeaders=host&X-Amz-Expires=299&X-Amz-Credential=AKIAYSGP3F75JOYOPKA7%2F20241025%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5afcc597f4d30d595ff08d7ed445ba70b8b05abf90b9d2e7b5902149909a098e'; // Example presigned URL
  };

  // Handle file download by programmatically triggering a click on the link
  const handleDownload = () => {
    if (presignedUrl) {
      const link = document.createElement('a');
      link.href = presignedUrl;
      link.setAttribute('download', ''); // Forces the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM
    }
  };

  // Navigate back to the home page
  const handleCancel = () => {
    navigate('/'); // Redirect to Home Catalog List page
  };

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
      {files.length > 0 ? (
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
      ) : (
        <p>No files available.</p>
      )}

      {/* Download Button */}
      <div className="mt-4">
        {loading ? (
          <p>Loading download link...</p>
        ) : (
          presignedUrl && (
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handleDownload}
            >
              Download File
            </button>
          )
        )}
      </div>

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
