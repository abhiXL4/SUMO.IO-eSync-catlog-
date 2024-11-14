// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import CryptoJS from 'crypto-js';

// const UploadPage = () => {
//   const [fileUploads, setFileUploads] = useState([{ id: 1, file: null, md5Hash: null }]);
//   const [selectedECU, setSelectedECU] = useState('');
//   const [vendorName, setVendorName] = useState('');
//   const [vehicleModel, setVehicleModel] = useState('');
//   const [sequenceFile, setSequenceFile] = useState(null);
//   const [vehicleVariant, setVehicleVariant] = useState('');
//   const [releaseVersion, setReleaseVersion] = useState('');
//   const [swVersion, setSwVersion] = useState('');
//   const [hwPartNumber, setHwPartNumber] = useState('');
//   const [communicationProtocol, setCommunicationProtocol] = useState('');
//   const [securityMethod, setSecurityMethod] = useState('');
//   const [securityLevel, setSecurityLevel] = useState('');
//   const [fwSignature, setFwSignature] = useState('');
//   const [catalogType, setCatalogType] = useState('SW_Catalogue');
//   const [parameterFile, setParameterFile] = useState(null);
//   const [parameterFiles, setParameterFiles] = useState([]);
//   const [configId, setConfigId] = useState('');
//   const [configOptions, setConfigOptions] = useState([]);
//   const [sequenceName, setSequenceName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showParameterFileRow, setShowParameterFileRow] = useState(false);
//   const navigate = useNavigate();
//   const [showParameterSection, setShowParameterSection] = useState(false);  

//   // const handleFileChange = (index, event) => {
//   //   const selectedFile = event.target.files[0];
//   //   if (selectedFile) {
//   //     const reader = new FileReader();
//   //     reader.onload = (e) => {
//   //       const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
//   //       const md5Hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray)); // Base64 encoded MD5 hash
  
//   //       setFileUploads((prevUploads) =>
//   //         prevUploads.map((upload) =>
//   //           upload.id === index
//   //             ? { ...upload, file: selectedFile, md5Hash, fileType: selectedFile.type, fileSize: selectedFile.size }
//   //             : upload
//   //         )
//   //       );
//   //     };
//   //     reader.readAsArrayBuffer(selectedFile);
//   //   }
//   // };

//   // const handleFileChange = (index, event, isParameterFile = false) => {
//   //   const selectedFile = event.target.files[0];
//   //   if (selectedFile) {
//   //     const reader = new FileReader();
//   //     reader.onload = (e) => {
//   //       const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
//   //       const md5Hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray)); // Base64 encoded MD5 hash

//   //       if (isParameterFile) {
//   //         setParameterFiles((prevFiles) =>
//   //           prevFiles.map((paramFile) =>
//   //             paramFile.id === index
//   //               ? { ...paramFile, file: selectedFile, md5Hash }
//   //               : paramFile
//   //           )
//   //         );
//   //       } else {
//   //         setFileUploads((prevUploads) =>
//   //           prevUploads.map((upload) =>
//   //             upload.id === index
//   //               ? { ...upload, file: selectedFile, md5Hash }
//   //               : upload
//   //           )
//   //         );
//   //       }
//   //     };
//   //     reader.readAsArrayBuffer(selectedFile);
//   //   }
//   // };


//   const handleFileChange = (id, event, isParameterFile = false) => {
//     const file = event.target.files[0];
//     if (isParameterFile) {
//       setParameterFiles((prevFiles) =>
//         prevFiles.map((paramFile) =>
//           paramFile.id === id ? { ...paramFile, file } : paramFile
//         )
//       );
//     } else {
//       setSequenceFile(file);
//     }
//   };
  

//   const handleRemoveFile = (id) => {
//     setFileUploads((prevUploads) => prevUploads.filter((upload) => upload.id !== id));
//   };

//   const handleAddFile = () => {
//     setFileUploads((prevUploads) => [...prevUploads, { id: prevUploads.length + 1, file: null, md5Hash: null }]);
//   };

//   const requestPresignedUrls = async () => {
//     try {
//       // Constructing the payload
//       const metadataPayload = {
//         catalogType, 
//         ecuName: selectedECU,
//         releaseVersion,
//         configVersion: swVersion,
//         vendorName,
//         vehicleModel,
//         vehicleVariant,
//         securityInfo: {
//           securityMethod,
//           securityLevel,
//           fwSignature,
//         },
//         fileMetadata: fileUploads
//           .filter((upload) => upload.file) // Only include selected files
//           .map((upload) => ({
//             fileName: upload.file.name,
//             fileType: upload.fileType,
//             fileSize: upload.fileSize,
//             md5: upload.md5Hash,
//             status: 'pending', // Initial status
//           })),
//       };

//       const response = await axios.post(
//         'http://localhost:8080/api/catalogue_items/presigned_urls',
//         metadataPayload
//       );

//       console.log('Received presigned URLs:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error requesting presigned URLs:', error);
//       alert('Error requesting presigned URLs. Please try again.');
//       return [];
//     }
//   };


//   const handleAddParameterFile = () => {
//     setShowParameterSection(true);
//     setParameterFiles((prevFiles) => [
//       ...prevFiles,
//       { id: Date.now(), vehicleModel: '', variant: '', file: null }
//     ]);
//   };
  

//   const handleRemoveParameterFile = (id) => {
//     setParameterFiles((prevFiles) => prevFiles.filter((paramFile) => paramFile.id !== id));
//     if (parameterFiles.length <= 1) setShowParameterSection(false); // Hide section if no files left
//   };



//   // const handleParameterFileChange = (id, field, value) => {
//   //   setParameterFiles((prevFiles) =>
//   //     prevFiles.map((paramFile) =>
//   //       paramFile.id === id ? { ...paramFile, [field]: value } : paramFile
//   //     )
//   //   );
//   // };



//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const response = await requestPresignedUrls();
//       const presignedUrls = response.presignedUrlList; // Access presignedUrlList from response
//       const uploadPromises = fileUploads.map(async (upload, index) => {
//         const presignedData = presignedUrls[index];
        
//         if (upload.file && presignedData?.presignedUrl) {
//           try {
//             console.log(`Starting upload for ${upload.file.name}`);
//             await uploadFileToS3(upload.file, presignedData.presignedUrl, presignedData['Content-MD5']);
//             await updateFileStatus(presignedData['MD5'], 'uploaded');
//           } catch (error) {
//             await updateFileStatus(presignedData['MD5'], 'failed');
//             alert(`Upload failed for ${upload.file.name}: ${error.message}`);
//           }
//         }
//       });
  
//       await Promise.all(uploadPromises);
//       alert('All files uploaded successfully');
//     } catch (error) {
//       console.error('Error during file upload:', error);
//       alert('Error during file upload. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
  
//   const uploadFileToS3 = async (file, presignedUrl, contentMD5) => {
//     try {
//       const response = await axios.put(presignedUrl, file, {
//         headers: {
//           'Content-Type': file.type,
//           'Content-MD5': contentMD5,
//         },
//       });
//       console.log(`File ${file.name} uploaded successfully`, response);
//       return 'uploaded';
//     } catch (error) {
//       console.error(`Error uploading file ${file.name}:`, error);
//       throw new Error(`Failed to upload ${file.name}: ${error.message}`);
//     }
//   };
  
//   // const handleParameterFileChange = (event) => {
//   //   const selectedFile = event.target.files[0];
//   //   if (selectedFile) {
//   //     const reader = new FileReader();
//   //     reader.onload = (e) => {
//   //       const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
//   //       const md5Hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray));
//   //       setParameterFile({ file: selectedFile, md5Hash });
//   //     };
//   //     reader.readAsArrayBuffer(selectedFile);
//   //   }
//   // };

//   const handleParameterFileChange = (id, field, value) => {
//     setParameterFiles((prevFiles) =>
//       prevFiles.map((paramFile) =>
//         paramFile.id === id ? { ...paramFile, [field]: value } : paramFile
//       )
//     );
//   };
  
  
//   const updateFileStatus = async (md5Hash, status) => {
//     try {
//       await axios.get('http://localhost:8080/api/catalogue_items/check-status', { params: { md5Hash, status } });

//       console.log(`Status "${status}" for MD5 "${md5Hash}" sent successfully.`);
//     } catch (error) {
//       console.error('Error updating file status:', error);
//     }
//   };

//   // Function to generate random config IDs
//   const generateConfigOptions = () => {
//     const options = [];
//     for (let i = 0; i < 4; i++) {
//       const randomString = `ID-${Math.random().toString(36).substring(2, 8)}-${Math.floor(Math.random() * 1000)}`;
//       options.push(randomString);
//     }
//     setConfigOptions(options);
//   };

//   const handleCancel = () => {
//     window.location.href = '/';
//   };
  

//   return (
//     <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">CONFIG UPLOAD</h1>
//       <div className="border rounded-lg p-6 bg-white shadow-md">

//         {/* Sequence File Section */}
//         <div className="border border-black rounded-lg p-4 mb-6">
//           <h2 className="text-lg font-semibold text-gray-700 mb-4">Sequence File</h2>
//           <div className="flex items-center mb-4">
//             <label className="text-sm text-gray-700 mr-2">ECU:</label>
//             <select
//               className="border border-gray-300 rounded-md p-1 text-sm bg-yellow-400 text-gray-800 mr-6"
//               value={selectedECU}
//               onChange={(e) => setSelectedECU(e.target.value)}
//             >
//               <option value="" disabled>Select ECU</option>
//               <option value="BCM">BCM</option>
//               <option value="FATC">FATC</option>
//             </select>

//             <label className="text-sm text-gray-700 mr-2">Vendor:</label>
//             <select
//               className="border border-gray-300 rounded-md p-1 text-sm bg-yellow-400 text-gray-800 mr-6"
//               value={vendorName}
//               onChange={(e) => setVendorName(e.target.value)}
//             >
//               <option value="" disabled>Select Vendor</option>
//               <option value="Bosch">Bosch</option>
//               <option value="Harman">Harman</option>
//             </select>

//             <label className="text-sm text-gray-700 mr-2">Sequence Name:</label>
//             <input
//               type="text"
//               placeholder="Sequence_Name"
//               value={sequenceName}
//               onChange={(e) => setSequenceName(e.target.value)}
//               className="border border-gray-300 rounded-md p-1 text-sm bg-yellow-400 text-gray-800 mr-6"
//             />

//             <label className="text-sm text-gray-700 mr-2">Sequence File:</label>
//             <input
//               type="file"
//               accept=".xml"
//               onChange={(e) => handleFileChange(1, e)}
//               className="border border-gray-300 rounded-md p-1 text-sm bg-blue-400 text-gray-800 mr-4"
//             />

//             <button
//               type="button"
//               onClick={handleAddParameterFile}
//               className="bg-yellow-300 text-black rounded-md px-2 py-1 text-sm hover:bg-yellow-400 transition"
//             >
//               +
//             </button>
//           </div>
//         </div>

//         {/* Parameter Files Section - Only Visible After Clicking '+' */}
//         {showParameterSection && (
//           <div className="border border-black rounded-lg p-4 mb-6">
//             <h2 className="text-lg font-semibold text-gray-700 mb-4">Parameter Files</h2>
//             {parameterFiles.map((paramFile) => (
//               <div key={paramFile.id} className="flex items-center mb-4">
//                 <label className="text-sm text-gray-700 mr-2">Vehicle Model:</label>
//                 <select
//                   className="border border-gray-300 rounded-md p-1 text-sm bg-yellow-400 text-gray-800 mr-6"
//                   value={paramFile.vehicleModel}
//                   onChange={(e) =>
//                     handleParameterFileChange(paramFile.id, 'vehicleModel', e.target.value)
//                   }
//                 >
//                   <option value="" disabled>Select Vehicle Model</option>
//                   <option value="BCM">BCM</option>
//                   <option value="FATC">FATC</option>
//                 </select>

//                 <label className="text-sm text-gray-700 mr-2">Variant:</label>
//                 <input
//                   type="text"
//                   placeholder="Variant"
//                   value={paramFile.variant}
//                   onChange={(e) =>
//                     handleParameterFileChange(paramFile.id, 'variant', e.target.value)
//                   }
//                   className="border border-gray-300 rounded-md p-1 text-sm bg-yellow-400 text-gray-800 mr-6"
//                 />

//                 <label className="text-sm text-gray-700 mr-2">File:</label>
//                 <input
//                   type="file"
//                   accept=".xml"
//                   onChange={(e) => handleFileChange(paramFile.id, e, true)}
//                   className="border border-gray-300 rounded-md p-1 text-sm bg-blue-400 text-gray-800 mr-4"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => handleRemoveParameterFile(paramFile.id)}
//                   className="bg-red-500 text-white rounded-md px-2 py-1 text-sm hover:bg-red-600 transition"
//                 >
//                   -
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Submit and Cancel Buttons */}
//         <div className="flex justify-end space-x-4 mt-4">
//           <button
//             onClick={handleCancel}
//             className="bg-red-400 text-white rounded-md px-3 py-1 text-sm hover:bg-red-500 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="bg-green-500 text-white rounded-md px-3 py-1 text-sm hover:bg-green-600 transition"
//           >
//             Save Config
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;




// import React, { useState } from 'react';
// import axios from 'axios';

// const UploadPage = () => {
//   const [fileUploads, setFileUploads] = useState([{ id: 1, file: null, md5Hash: null }]);
//   const [selectedECU, setSelectedECU] = useState('');
//   const [vendorName, setVendorName] = useState('');
//   const [sequenceFile, setSequenceFile] = useState(null);
//   const [parameterFiles, setParameterFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Handle file change for sequence and parameter files
//   const handleFileChange = (id, event, isParameterFile = false) => {
//     const file = event.target.files[0];
//     if (isParameterFile) {
//       setParameterFiles((prevFiles) =>
//         prevFiles.map((paramFile) =>
//           paramFile.id === id ? { ...paramFile, file } : paramFile
//         )
//       );
//     } else {
//       setSequenceFile(file);
//     }
//   };

//   // Add new parameter file input row
//   const handleAddParameterFile = () => {
//     setParameterFiles((prevFiles) => [
//       ...prevFiles,
//       { id: Date.now(), vehicleModel: '', variant: '', file: null }
//     ]);
//   };

//   // Remove parameter file input row
//   const handleRemoveParameterFile = (id) => {
//     setParameterFiles((prevFiles) => prevFiles.filter((paramFile) => paramFile.id !== id));
//   };

//   // Request presigned URLs for file uploads
//   const requestPresignedUrls = async () => {
//     try {
//       const metadataPayload = {
//         ecuName: selectedECU,
//         vendorName,
//         fileMetadata: fileUploads
//           .filter((upload) => upload.file)
//           .map((upload) => ({
//             fileName: upload.file.name, 
//             fileType: upload.file.type,
//             fileSize: upload.file.size,
//             md5: upload.md5Hash,
//             status: 'pending',
//           })),
//       };

//       const response = await axios.post(
//         'http://localhost:8080/api/catalogue_items/presigned_urls',
//         metadataPayload
//       );

//       return response.data;
//     } catch (error) {
//       console.error('Error requesting presigned URLs:', error);
//       alert('Error requesting presigned URLs. Please try again.');
//       return [];
//     }
//   };

//   // Upload file to S3
//   const uploadFileToS3 = async (file, presignedUrl, contentMD5) => {
//     try {
//       await axios.put(presignedUrl, file, {
//         headers: {
//           'Content-Type': file.type,
//           'Content-MD5': contentMD5,
//         },
//       });
//     } catch (error) {
//       throw new Error(`Failed to upload ${file.name}: ${error.message}`);
//     }
//   };

//   // Handle submit for file upload
//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const response = await requestPresignedUrls();
//       const presignedUrls = response.presignedUrlList;

//       const uploadPromises = fileUploads.map(async (upload, index) => {
//         const presignedData = presignedUrls[index];
        
//         if (upload.file && presignedData?.presignedUrl) {
//           try {
//             await uploadFileToS3(upload.file, presignedData.presignedUrl, presignedData['Content-MD5']);
//           } catch (error) {
//             alert(`Upload failed for ${upload.file.name}: ${error.message}`);
//           }
//         }
//       });
  
//       await Promise.all(uploadPromises);
//       alert('All files uploaded successfully');
//     } catch (error) {
//       console.error('Error during file upload:', error);
//       alert('Error during file upload. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-8 min-h-screen">
//       <h1 className="text-2xl font-bold text-center mb-6">CONFIG UPLOAD</h1>
//       <div className="border rounded-lg p-6 shadow-md">
//         <div className="border border-black rounded-lg p-4 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Sequence File</h2>
//           <div className="flex items-center mb-4">
//             <label className="text-sm mr-2">ECU:</label>
//             <select
//               value={selectedECU}
//               onChange={(e) => setSelectedECU(e.target.value)}
//               className="p-1 mr-6"
//             >
//               <option value="" disabled>Select ECU</option>
//               <option value="BCM">BCM</option>
//               <option value="FATC">FATC</option>
//             </select>

//             <label className="text-sm mr-2">Vendor:</label>
//             <select
//               value={vendorName}
//               onChange={(e) => setVendorName(e.target.value)}
//               className="p-1 mr-6"
//             >
//               <option value="" disabled>Select Vendor</option>
//               <option value="Bosch">Bosch</option>
//               <option value="Harman">Harman</option>
//             </select>

//             <label className="text-sm mr-2">Sequence Name:</label>
//             <input
//               type="text"
//               value={sequenceFile?.name || ''}
//               onChange={() => {}}
//               className="p-1 mr-6"
//               disabled
//             />

//             <input
//               type="file"
//               accept=".xml"
//               onChange={(e) => handleFileChange(1, e)}
//               className="p-1 mr-4"
//             />

//             <button
//               onClick={handleAddParameterFile}
//               className="text-black"
//             >
//               +
//             </button>
//           </div>

//           {parameterFiles.map((paramFile) => (
//             <div key={paramFile.id} className="flex items-center mb-4">
//               <input
//                 type="file"
//                 accept=".xml"
//                 onChange={(e) => handleFileChange(paramFile.id, e, true)}
//                 className="p-1 mr-4"
//               />
//               <button
//                 onClick={() => handleRemoveParameterFile(paramFile.id)}
//                 className="text-red-500"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="text-center">
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="bg-green-500 text-white p-2 rounded-md"
//           >
//             {loading ? 'Uploading...' : 'Upload Files'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;




import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const UploadPage = () => {
  const [fileUploads, setFileUploads] = useState([{ id: 1, file: null, md5Hash: null }]);
  const [selectedECU, setSelectedECU] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [sequenceFile, setSequenceFile] = useState(null);
  const [parameterFiles, setParameterFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showParameterSection, setShowParameterSection] = useState(false); // State to toggle parameter section

  // Sample vehicle models for dropdown
  const vehicleModels = [
    { id: 'model1', name: 'Model 1' },
    { id: 'model2', name: 'Model 2' },
    { id: 'model3', name: 'Model 3' },
  ];

  // Calculate MD5 hash of the file
  const calculateMD5 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
        const md5Hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray));
        resolve(md5Hash);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Handle file change for sequence and parameter files
  const handleFileChange = async (id, event, isParameterFile = false) => {
    const file = event.target.files[0];
    if (file) {
      const md5Hash = await calculateMD5(file);

      if (isParameterFile) {
        setParameterFiles((prevFiles) =>
          prevFiles.map((paramFile) =>
            paramFile.id === id ? { ...paramFile, file, md5Hash } : paramFile
          )
        );
      } else {
        setSequenceFile({ file, md5Hash });
      }
    }
  };

  // Handle add parameter file row
  const handleAddParameterFile = () => {
    setParameterFiles((prevFiles) => [
      ...prevFiles,
      { id: Date.now(), vehicleModel: '', variant: '', file: null, md5Hash: null }
    ]);
  };

  // Handle change for parameter file fields
  const handleParameterFileChange = (id, field, value) => {
    setParameterFiles((prevFiles) =>
      prevFiles.map((paramFile) =>
        paramFile.id === id ? { ...paramFile, [field]: value } : paramFile
      )
    );
  };

  // Request presigned URLs from the backend
  const requestPresignedUrls = async (fileMetadata) => {
    try {
      const metadataPayload = {
        ecuName: selectedECU,
        vendorName,
        fileMetadata: fileMetadata.map((upload) => ({
          fileName: upload.file.name,
          fileType: upload.file.type,
          fileSize: upload.file.size,
          md5: upload.md5Hash,
          status: 'pending',
        })),
      };

      const response = await axios.post(
        'http://localhost:8080/api/catalogue_items/presigned_urls',
        metadataPayload
      );

      return response.data;
    } catch (error) {
      console.error('Error requesting presigned URLs:', error);
      alert('Error requesting presigned URLs. Please try again.');
      return [];
    }
  };

  // Upload file to S3 using presigned URL
  const uploadFileToS3 = async (file, presignedUrl, contentMD5) => {
    try {
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
          'Content-MD5': contentMD5,
        },
      });
    } catch (error) {
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }
  };

  // Handle form submission (upload files to S3)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Collect file metadata for sequence files and parameter files
      const fileMetadata = [
        { file: sequenceFile?.file, md5Hash: sequenceFile?.md5Hash },
        ...parameterFiles.filter((file) => file.file).map((file) => ({
          file: file.file,
          md5Hash: file.md5Hash,
        })),
      ];

      // Request presigned URLs for all files
      const response = await requestPresignedUrls(fileMetadata);
      const presignedUrls = response.presignedUrlList;

      // Upload sequence file
      if (sequenceFile?.file && presignedUrls[0]?.presignedUrl) {
        await uploadFileToS3(sequenceFile.file, presignedUrls[0].presignedUrl, presignedUrls[0]['Content-MD5']);
      }

      // Upload parameter files
      const uploadPromises = parameterFiles.map(async (paramFile, index) => {
        if (paramFile.file && presignedUrls[index + 1]?.presignedUrl) {
          try {
            await uploadFileToS3(paramFile.file, presignedUrls[index + 1].presignedUrl, presignedUrls[index + 1]['Content-MD5']);
          } catch (error) {
            alert(`Upload failed for ${paramFile.file.name}: ${error.message}`);
          }
        }
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      alert('All files uploaded successfully');
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('Error during file upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">CONFIG UPLOAD</h1>
      <div className="border rounded-lg p-6 shadow-md bg-white">
        {/* Sequence File Section */}
        <div className="border border-black rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sequence File</h2>
          <div className="flex items-center mb-4">
            <label className="text-sm mr-2">ECU:</label>
            <select
              value={selectedECU}
              onChange={(e) => setSelectedECU(e.target.value)}
              className="p-1 mr-6 bg-yellow-400 rounded-md"
            >
              <option value="" disabled>Select ECU</option>
              <option value="BCM">BCM</option>
              <option value="FATC">FATC</option>
            </select>

            <label className="text-sm mr-2">Vendor:</label>
            <select
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="p-1 mr-6 bg-yellow-400 rounded-md"
            >
              <option value="" disabled>Select Vendor</option>
              <option value="Bosch">Bosch</option>
              <option value="Harman">Harman</option>
            </select>

            <label className="text-sm mr-2">Select Existing Sequence:</label>
            <select
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="p-1 mr-6 bg-yellow-400 rounded-md"
            >
              <option value="" disabled>Select Existing Sequence:</option>
              <option value="Bosch">Sequence_1.xml</option>
              <option value="Harman">Sequence_2.xml</option>
            </select>

            <input
              type="file"
              accept=".xml"
              onChange={(e) => handleFileChange(1, e)}
              className="p-1 mr-4 bg-blue-400 rounded-md"
            />
            <button
              onClick={() => setShowParameterSection(!showParameterSection)} // Toggle parameter section visibility
              className="bg-yellow-200 text-black rounded-md px-2 py-1 hover:bg-yellow-400"
            >
              {showParameterSection ? '-' : '+'}
            </button>
          </div>
        </div>

        {/* Parameter Files Section */}
        {showParameterSection && (
          <div className="border border-black rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Parameter Files</h2>
            <div className="flex mb-4">
              <select
                onChange={(e) => handleParameterFileChange(fileUploads[0].id, 'vehicleModel', e.target.value)}
                className="p-1 mr-2 bg-yellow-400 rounded-md"
              >
                <option value="">Select Vehicle Model</option>
                {vehicleModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>

              <input
                type="file"
                onChange={(e) => handleFileChange(fileUploads[0].id, e, true)}
                className="p-1 mr-2 bg-blue-400 rounded-md"
              />
              <button
                onClick={handleAddParameterFile}
                className="bg-yellow-200 text-black rounded-md px-2 py-1 hover:bg-yellow-400"
              >
                Add Parameter File
              </button>
            </div>
            {parameterFiles.map((paramFile) => (
              <div key={paramFile.id} className="flex items-center mb-2">
                <select
                  value={paramFile.vehicleModel}
                  onChange={(e) => handleParameterFileChange(paramFile.id, 'vehicleModel', e.target.value)}
                  className="p-1 mr-2 bg-yellow-400 rounded-md"
                >
                  <option value="">Select Vehicle Model</option>
                  {vehicleModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>

                <input
                  type="file"
                  accept=".xml"
                  onChange={(e) => handleFileChange(paramFile.id, e, true)}
                  className="p-1 mr-4 bg-blue-400 rounded-md"
                />
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
