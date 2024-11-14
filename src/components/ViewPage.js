// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';

// const ViewPage = () => {
//   const location = useLocation();
//   const { ecuName, containerId } = location.state; // Retrieve passed data (ECU name and container ID)
//   const [files, setFiles] = useState([]); // State to hold files data
//   const navigate = useNavigate();

//   // Fetch files on component mount
//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/catalogue_items/ecu-files`,
//           { params: { ecuName, catalogueId: containerId } }
//         );
//         console.log("Fetched files:", response.data);
//         setFiles(response.data);
//       } catch (error) {
//         console.error("Error fetching files:", error);
//       }
//     };
//     fetchFiles();
//   }, [ecuName, containerId]);
  
  
  
  
  
//   const handleCancel = () => {
//     navigate('/'); // Redirect to Home Catalog List page
//   };

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
//       {files.length > 0 ? (
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
//                 <td className="p-2 border border-gray-300">{file.fileSize || 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No files available for this ECU.</p>
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















// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';

// const ViewPage = () => {
//   const location = useLocation();
//   const { ecuName, containerId } = location.state;
//   const [files, setFiles] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/catalogue_items/ecu-files`,  
//           { params: { ecuName, catalogueId: containerId } }
//         );
//         console.log("Fetched files:", response.data);
//         setFiles(response.data);
//       } catch (error) {
//         console.error("Error fetching files:", error);
//       }
//     };
//     fetchFiles();
//   }, [ecuName, containerId]);

//   const requestPresignedDownloadUrls = async () => {
//     try {
//       const response = await axios.get(
//         'http://localhost:8080/api/catalogue_items/download',
//         { params: { catalogueId: containerId } }
//       );
//       console.log('Received presigned download URLs:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error requesting presigned download URLs:', error);
//       alert('Error fetching download URLs. Please try again.');
//       return [];
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       // Step 1: Request presigned URLs from backend
//       const presignedUrls = await requestPresignedDownloadUrls();
      
//       if (!presignedUrls || presignedUrls.length === 0) {
//         alert('No files available for download.');
//         return;
//       }
  
//       // Step 2: Download each file using the presigned URL
//       presignedUrls.forEach((file) => {
//         const link = document.createElement('a');
//         link.href = file.presignedUrl;       // Presigned S3 URL
//         link.download = file.fileName;       // Set the filename
//         link.target = '_blank';              // Open in a new tab (optional, based on preference)
//         document.body.appendChild(link);     // Append the link to the body
//         link.click();                        // Programmatically click the link to start download
//         document.body.removeChild(link);     // Clean up by removing the link from DOM
//       });
  
//       alert('Download started for all files.');
//     } catch (error) {
//       console.error('Error during file download:', error);
//       alert('Error during file download. Please try again.');
//     }
//   };
  

//   const handleCancel = () => {
//     navigate('/');
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Details</h2>
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

//       {files.length > 0 ? (
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
//                 <td className="p-2 border border-gray-300">{file.fileSize || 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No files available for this ECU.</p>
//       )}

//       <button 
//         className="mt-4 bg-blue-500 text-white p-2 rounded" 
//         onClick={handleDownload}
//       >
//         Download
//       </button>

//       <div className="flex justify-end mt-4">
//         <button 
//           className="bg-green-500 text-white p-2 rounded"
//           onClick={handleCancel}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewPage;






import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ViewPage = () => {
  const location = useLocation();
  const { ecuName, containerId } = location.state;
  const [files, setFiles] = useState([]);
  // const [fileSize, fetchFileSizes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/catalogue_items/ecu-files',
          { params: { ecuName, catalogueId: containerId } }
        );
        console.log('Fetched files:', response.data);
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, [ecuName, containerId]);

  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     try {
  //       const response = await axios.get(
  //         'http://localhost:8080/api/catalogue_items/ecu-files',
  //         { params: { ecuName, catalogueId: containerId } }
  //       );
  //       console.log('Fetched files:', response.data);
  //       fetchFileSizes(response.data); // Fetch file sizes for presigned URLs
  //     } catch (error) {
  //       console.error('Error fetching files:', error);
  //     }
  //   };
  //   fetchFiles();
  // }, [ecuName, containerId]);
  
  

  // Function to request presigned URLs from the backend
  const requestPresignedDownloadUrls = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/catalogue_items/download',
        { params: { catalogueId: containerId } }
      );
      console.log('Received presigned download URLs:', response.data);
  
      // Ensure only unique files are processed
      const files = response.data.length > 0 ? response.data[0].files : [];
      const validFiles = files.filter((file, index, self) =>
        index === self.findIndex(f => f.presignedUrl === file.presignedUrl) // Only unique presigned URLs
      );
  
      return validFiles;
    } catch (error) {
      console.error('Error requesting presigned download URLs:', error);
      alert('Error fetching download URLs. Please try again.');
      return [];
    }
  };
  

  // const handleDownload = async () => {
  //   try {
  //     const presignedUrls = await requestPresignedDownloadUrls();
  
  //     if (!presignedUrls || presignedUrls.length === 0) {
  //       alert('No valid files available for download.');
  //       return;
  //     }
  
  //     // Process each file's presigned URL exactly once
  //     const processedUrls = new Set(); // Track URLs already downloaded
  //     for (const file of presignedUrls) {
  //       if (file.presignedUrl && !processedUrls.has(file.presignedUrl)) {
  //         processedUrls.add(file.presignedUrl); // Mark URL as processed
  
  //         const response = await fetch(file.presignedUrl);
          
  //         if (!response.ok) {
  //           console.error(`Failed to fetch file. Status: ${response.status} - ${response.statusText}`);
  //           if (response.status === 403) {
  //             alert('Access forbidden. The URL might be expired or permissions are incorrect.');
  //           }
  //           throw new Error(`Failed to fetch file: ${response.statusText}`);
  //         }
  
  //         // Extract filename from Content-Disposition header if available
  //         const disposition = response.headers.get('Content-Disposition');
  //         let fileName = file.fileName || 'download'; // Fallback to file.fileName if header not present
  
  //         if (disposition && disposition.includes('filename=')) {
  //           const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
  //           if (fileNameMatch.length > 1) {
  //             fileName = fileNameMatch[1]; // Extract filename from the header
  //           }
  //         }
  
  //         // Create a blob from the response data
  //         const blob = await response.blob();
          
  //         // Create a temporary anchor element to trigger the download
  //         const link = document.createElement('a');
  //         const url = window.URL.createObjectURL(blob);
  //         link.href = url;
  //         link.download = fileName; // Set filename for the download
  //         document.body.appendChild(link);
  //         link.click(); // Trigger download
  //         document.body.removeChild(link); // Remove link after triggering download
  
  //         // Revoke the object URL to free up memory, delay slightly to ensure download completes
  //         setTimeout(() => window.URL.revokeObjectURL(url), 100);
  //       }
  //     }
  
  //     alert('Download started for available files.');
  //   } catch (error) {
  //     console.error('Error during file download:', error);
  //     alert('Error during file download. Please try again.');
  //   }
  // };

  const handleDownload = async () => {
    try {
      const presignedUrls = await requestPresignedDownloadUrls();
  
      if (!presignedUrls || presignedUrls.length === 0) {
        alert('No valid files available for download.');
        return;
      }
  
      // Process each file's presigned URL exactly once
      const processedUrls = new Set(); // Track URLs already downloaded
      for (const file of presignedUrls) {
        if (file.presignedUrl && !processedUrls.has(file.presignedUrl)) {
          processedUrls.add(file.presignedUrl); // Mark URL as processed
  
          const response = await fetch(file.presignedUrl);
          
          if (!response.ok) {
            console.error(`Failed to fetch file. Status: ${response.status} - ${response.statusText}`);
            if (response.status === 403) {
              alert('Access forbidden. The URL might be expired or permissions are incorrect.');
            }
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }
  
          // Extract filename from Content-Disposition header if available
          const disposition = response.headers.get('Content-Disposition');
          let fileName = file.fileName || 'download'; // Fallback to file.fileName if header not present
  
          if (disposition && disposition.includes('filename=')) {
            const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
            if (fileNameMatch.length > 1) {
              fileName = fileNameMatch[1]; // Extract filename from the header
            }
          }
  
          // Create a blob from the response data
          const blob = await response.blob();
          
          // Create a temporary anchor element to trigger the download
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = fileName; // Set filename for the download
          document.body.appendChild(link);
          link.click(); // Trigger download
          document.body.removeChild(link); // Remove link after triggering download
  
          // Revoke the object URL to free up memory, delay slightly to ensure download completes
          setTimeout(() => window.URL.revokeObjectURL(url), 100);
        }
      }
  
      alert('Download started for available files.');
    } catch (error) {
      console.error('Error during file download:', error);
      alert('Error during file download. Please try again.');
    }
  };

  
  
  
  
  
  

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Details</h2>
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

      {files.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-300 text-left">SW Name</th>
              {/* <th className="p-2 border border-gray-300 text-left">SW Size</th> */}
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-300">{file.fileName}</td>
                {/* <td className="p-2 border border-gray-300">{file.fileSize !== undefined ? file.fileSize : 'N/A'}</td> */}
                </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No files available for this ECU.</p>
      )}

      <button 
        className="mt-4 bg-blue-500 text-white p-2 rounded" 
        onClick={handleDownload}
      >
        Download
      </button>

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






















// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const ViewPage = () => {
//   const location = useLocation();
//   const { ecuName, containerId } = location.state || {}; // Retrieve passed data (ECU name and container ID)
//   const navigate = useNavigate();

//   const [presignedUrl, setPresignedUrl] = useState(''); // State to hold presigned URL
//   const [loading, setLoading] = useState(true); // State for loading indicator
//   const [files, setFiles] = useState([]); // Placeholder for files data, can be fetched dynamically

//   // Simulate fetching the presigned URL from an API or backend when component mounts
//   useEffect(() => {
//     const fetchPresignedUrl = async () => {
//       try {
//         // Replace with actual API call to get the presigned URL
//         const url = await fetchPresignedUrlFromAPI();
//         setPresignedUrl(url);
//       } catch (error) {
//         console.error('Error fetching presigned URL:', error);
//       } finally {
//         setLoading(false); // Set loading to false after the URL is fetched
//       }
//     };

//     fetchPresignedUrl();

//     // Simulate fetching file list data (can be replaced with actual API call)
//     setFiles([
//       { fileName: 'Software_v1.0.bin', fileSize: '1.2 MB' },
//       { fileName: 'Software_v2.0.bin', fileSize: '1.5 MB' }
//     ]);
//   }, []);

//   // Simulated API call to fetch presigned URL (replace with your actual API logic)
//   const fetchPresignedUrlFromAPI = async () => {
//     return 'https://catalogue-manager-test.s3.amazonaws.com/Automotive-SPICE01.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20241025T061611Z&X-Amz-SignedHeaders=host&X-Amz-Expires=299&X-Amz-Credential=AKIAYSGP3F75JOYOPKA7%2F20241025%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5afcc597f4d30d595ff08d7ed445ba70b8b05abf90b9d2e7b5902149909a098e'; // Example presigned URL
//   };

//   // Handle file download by programmatically triggering a click on the link
//   const handleDownload = () => {
//     if (presignedUrl) {
//       const link = document.createElement('a');
//       link.href = presignedUrl;
//       link.setAttribute('download', ''); // Forces the download
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link); // Clean up the DOM
//     }
//   };

//   // Navigate back to the home page
//   const handleCancel = () => {
//     navigate('/'); // Redirect to Home Catalog List page
//   };

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
//       {files.length > 0 ? (
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
//       ) : (
//         <p>No files available.</p>
//       )}

//       {/* Download Button */}
//       <div className="mt-4">
//         {loading ? (
//           <p>Loading download link...</p>
//         ) : (
//           presignedUrl && (
//             <button
//               className="bg-blue-500 text-white p-2 rounded"
//               onClick={handleDownload}
//             >
//               Download File
//             </button>
//           )
//         )}
//       </div>

//       <div className="flex justify-end mt-4">
//         <button 
//           className="bg-green-500 text-white p-2 rounded"
//           onClick={handleCancel}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewPage;
