// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCatalogList } from '../services/apiService'; // Adjust the path based on your structure
// import axios from 'axios'; // Import axios for making requests

// const UploadPage = () => {
//   const [fileUploads, setFileUploads] = useState([{ id: 1, file: null }]);
//   const [configCatalog, setConfigCatalog] = useState([]);
//   const [selectedECU, setSelectedECU] = useState('');
//   const [selectedConfigId, setSelectedConfigId] = useState('');
//   const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch Config Catalog
//     const fetchConfigCatalog = async () => {
//       try {
//         const data = await getCatalogList('config-catalog');
//         setConfigCatalog(data);
//       } catch (error) {
//         console.error('Error fetching Config Catalog:', error);
//       }
//     };

//     fetchConfigCatalog();
//   }, []);

//   const handleAddFile = () => {
//     const newFileUpload = { id: fileUploads.length + 1, file: null };
//     setFileUploads([...fileUploads, newFileUpload]);
//   };

//   const handleRemoveFile = (id) => {
//     const updatedFiles = fileUploads.filter((file) => file.id !== id);
//     setFileUploads(updatedFiles);
//   };

//   const handleCancel = () => {
//     navigate('/');
//   };

//   const handleECUChange = (event) => {
//     setSelectedECU(event.target.value);
//   };

//   const handleConfigIdChange = (event) => {
//     setSelectedConfigId(event.target.value);
//   };

//   // Handle file selection
//   const handleFileChange = (index, event) => {
//     const selectedFile = event.target.files[0];
//     const updatedFileUploads = fileUploads.map((fileUpload) =>
//       fileUpload.id === index ? { ...fileUpload, file: selectedFile } : fileUpload
//     );
//     setFileUploads(updatedFileUploads);
//   };

//   // Request presigned URL from backend and upload file to S3
//   const uploadFile = async (file) => {
//     try {
//       // Step 1: Request presigned URL from backend
//       const response = await axios.get('/generate-presigned-url', {
//         params: { fileName: file.name, contentType: file.type },
//       });
//       const presignedUrl = response.data.url;

//       // Step 2: Upload file to S3 using the presigned URL
//       await axios.put(presignedUrl, file, {
//         headers: {
//           'Content-Type': file.type,
//         },
//       });

//       console.log(`File ${file.name} uploaded successfully`);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     for (const fileUpload of fileUploads) {
//       if (fileUpload.file) {
//         await uploadFile(fileUpload.file); // Upload each selected file
//       }
//     }
//     console.log('All files uploaded');
//   };

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8">SW Catalog</h1>

//       <div className="border rounded-lg p-8 bg-white shadow-md">
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block font-semibold mb-2">Select ECU</label>
//             <select
//               className="w-full border border-gray-300 rounded p-2"
//               value={selectedECU}
//               onChange={handleECUChange}
//             >
//               <option value="">Select ECU</option>
//               {configCatalog.map((item) => (
//                 <option key={item.ecuName} value={item.ecuName}>
//                   {item.ecuName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">Select Config ID</label>
//             <select
//               className="w-full border border-gray-300 rounded p-2"
//               value={selectedConfigId}
//               onChange={handleConfigIdChange}
//             >
//               <option value="">Select Config ID</option>
//               {configCatalog
//                 .filter((item) => item.ecuName === selectedECU)
//                 .map((item) => (
//                   <option key={item.configId} value={item.configId}>
//                     {item.configId}
//                   </option>
//                 ))}
//             </select>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Vendor Name</label>
//           <select className="w-full border border-gray-300 rounded p-2">
//             <option value="">Select Vendor</option>
//             <option value="vendor1">Vendor 1</option>
//             <option value="vendor2">Vendor 2</option>
//             <option value="vendor3">Vendor 3</option>
//           </select>
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Vehicle Model</label>
//           <div className="flex items-center">
//             <input
//               type="radio"
//               id="harrier"
//               name="vehicleModel"
//               value="Harrier"
//               className="mr-2"
//               onChange={(e) => setSelectedVehicleModel(e.target.value)}
//             />
//             <label htmlFor="harrier" className="mr-4">Harrier</label>

//             <input
//               type="radio"
//               id="safari"
//               name="vehicleModel"
//               value="Safari"
//               className="mr-2"
//               onChange={(e) => setSelectedVehicleModel(e.target.value)}
//             />
//             <label htmlFor="safari" className="mr-4">Safari</label>

//             <input
//               type="radio"
//               id="curvv"
//               name="vehicleModel"
//               value="Curvv"
//               className="mr-2"
//               onChange={(e) => setSelectedVehicleModel(e.target.value)}
//             />
//             <label htmlFor="curvv" className="mr-4">Curvv</label>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Vehicle Variant</label>
//           <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., A1/XZ/AMA/Sport" />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">SW Release Version</label>
//           <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., 1.0" />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">HW Part Number</label>
//           <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., HW_123456" />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Communication Protocol</label>
//           <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., UDS/ETH" />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Security Access</label>
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block font-semibold mb-2">Security Method</label>
//               <input type="text" className="w-full border border-gray-300 rounded p-2" />
//             </div>
//             <div>
//               <label className="block font-semibold mb-2">Security Level</label>
//               <input type="text" className="w-full border border-gray-300 rounded p-2" />
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">FW Signature</label>
//           <input type="text" className="w-full border border-gray-300 rounded p-2" />
//         </div>

//         {/* File Upload Section */}
//         <h2 className="text-xl font-semibold mt-8 mb-4">File Upload</h2>
//         {fileUploads.map((file, index) => (
//           <div key={file.id} className="relative mb-4 border border-gray-300 rounded p-4">
//             <h3 className="font-semibold mb-2">File {index + 1}</h3>
//             <div className="grid grid-cols-4 gap-4">
//               <div>
//                 <label className="block font-semibold mb-2">Partition</label>
//                 <select className="w-full border border-gray-300 rounded p-2">
//                   <option value="">Select Partition</option>
//                   <option value="P1">Partition 1</option>
//                   <option value="P2">Partition 2</option>
//                   <option value="P3">Partition 3</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-semibold mb-2">File Format</label>
//                 <select className="w-full border border-gray-300 rounded p-2">
//                   <option value="">Select Format</option>
//                   <option value="intel-hex">Intel Hex</option>
//                   <option value="motorola">Motorola</option>
//                   <option value="binary">Binary</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-semibold mb-2">Start Address</label>
//                 <input type="text" className="w-full border border-gray-300 rounded p-2" />
//               </div>

//               <div>
//                 <label className="block font-semibold mb-2">Binary File Upload</label>
//                 <input type="file" className="w-full" onChange={(e) => handleFileChange(file.id, e)} />
//               </div>
//             </div>

//             <div className="grid grid-cols-4 gap-4 mt-4">
//               <div>
//                 <label className="block font-semibold mb-2">Compressed Size</label>
//                 <input type="text" className="w-full border border-gray-300 rounded p-2" />
//               </div>

//               <div>
//                 <label className="block font-semibold mb-2">Uncompressed Size</label>
//                 <input type="text" className="w-full border border-gray-300 rounded p-2" />
//               </div>

//               <div className="flex items-center">
//                 <input type="checkbox" className="mr-2" />
//                 <label>Is Encrypted</label>
//               </div>

//               <div className="flex items-center">
//                 <input type="checkbox" className="mr-2" />
//                 <label>Is Compressed</label>
//               </div>
//             </div>

//             {/* Plus Button */}
//             <div className="absolute right-4 bottom-4">
//               <button
//                 className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-blue-600"
//                 onClick={handleAddFile}
//               >
//                 +
//               </button>
//             </div>

//             {fileUploads.length > 1 && (
//               <div className="absolute right-12 bottom-4">
//                 <button
//                   className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600"
//                   onClick={() => handleRemoveFile(file.id)}
//                 >
//                   -
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}

//         <div className="mt-8">
//           <button
//             className="bg-blue-500 text-white px-6 py-2 rounded mr-4 hover:bg-blue-600"
//             onClick={handleSubmit}
//           >
//             Submit
//           </button>
//           <button
//             className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
//             onClick={handleCancel}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;


// import React, { useState } from 'react';

// const UploadPage = () => {
//   const [file, setFile] = useState(null);
//   const [catalogueType, setCatalogueType] = useState();
//   const [itemId, setItemId] = useState();
//   const [ecuName, setEcuName] = useState();
//   const [releaseVersion, setReleaseVersion] = useState();
//   const [configVersion, setConfigVersion] = useState();
//   const [vendorName, setVendorName] = useState();
//   const [vehicleModel, setVehicleModel] = useState();
//   const [vehicleVariant, setVehicleVariant] = useState();
//   const [createdAt] = useState(new Date().toISOString().split()[0]); // Today's date in YYYY-MM-DD format
//   const [createdBy] = useState(); // Static or dynamic user info can be used

//   // The presigned URL you want to use for the upload
//   const presignedUrl = 'https://catalogue-manager-test.s3.amazonaws.com/Automotive-SPICE.pdf?AWSAccessKeyId=AKIAYSGP3F75JOYOPKA7&Signature=Fb%2FLib5qbNcN0PBy8m%2Br3M8P9VU%3D&Expires=1729842416';

//   // Handle file selection
//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]); // Set the selected file in the state
//   };

//   // Function to upload the file to S3 using the presigned URL
//   const uploadFileToS3 = async () => {
//     if (!file) {
//       console.error('No file selected for upload');
//       return;
//     }

//     try {
//       // Perform the PUT request to the presigned URL
//       const response = await fetch(presignedUrl, {
//         method: 'PUT',
//         body: file,
//         headers: {
//           'Content-Type': file.type, // Set the content type based on the selected file
//         },
//       });

//       if (response.ok) {
//         console.log('File uploaded successfully');

//         // Prepare the metadata object
//         const metadata = {
//           catalogueType,
//           itemId,
//           ecuName,
//           releaseVersion,
//           configVersion,
//           vendorName,
//           vehicleModel,
//           vehicleVariant,
//           fileName: file.name, // Use the name of the uploaded file
//           createdAt,
//           createdBy,
//         };

//         console.log('Metadata to be sent:', metadata);
//         // Here you can send `metadata` to your backend or handle it as needed
//       } else {
//         const errorText = await response.text();
//         console.error('Failed to upload file to S3:', response.status, errorText);
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault(); // Prevent default form submission
//     uploadFileToS3(); // Trigger the file upload
//   };

//   return (
//     <div>
//       <h1>Upload File</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Catalogue Type:</label>
//           <input
//             type="text"
//             value={catalogueType}
//             onChange={(e) => setCatalogueType(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Item ID:</label>
//           <input
//             type="text"
//             value={itemId}
//             onChange={(e) => setItemId(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>ECU Name:</label>
//           <input
//             type="text"
//             value={ecuName}
//             onChange={(e) => setEcuName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Release Version:</label>
//           <input
//             type="text"
//             value={releaseVersion}
//             onChange={(e) => setReleaseVersion(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Config Version:</label>
//           <input
//             type="text"
//             value={configVersion}
//             onChange={(e) => setConfigVersion(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Vendor Name:</label>
//           <input
//             type="text"
//             value={vendorName}
//             onChange={(e) => setVendorName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Vehicle Model:</label>
//           <input
//             type="text"
//             value={vehicleModel}
//             onChange={(e) => setVehicleModel(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Vehicle Variant:</label>
//           <input
//             type="text"
//             value={vehicleVariant}
//             onChange={(e) => setVehicleVariant(e.target.value)}
//           />
//         </div>
//         <div>
//           <input type="file" onChange={handleFileChange} />
//         </div>
//         <button type="submit">Upload File</button>
//       </form>
//     </div>
//   );
// };

// export default UploadPage;






// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCatalogList } from '../services/apiService';
// import axios from 'axios';

// const UploadPage = () => {
//   const [fileUploads, setFileUploads] = useState([{ id: 1, file: null }]);
//   const [configCatalog, setConfigCatalog] = useState([]);
//   const [selectedECU, setSelectedECU] = useState('');
//   const [selectedConfigId, setSelectedConfigId] = useState('');
//   const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
//   const [vendorName, setVendorName] = useState('');
//   const [vehicleVariant, setVehicleVariant] = useState('');
//   const [releaseVersion, setReleaseVersion] = useState('');
//   const [hwPartNumber, setHwPartNumber] = useState('');
//   const [communicationProtocol, setCommunicationProtocol] = useState('');
//   const [securityMethod, setSecurityMethod] = useState('');
//   const [securityLevel, setSecurityLevel] = useState('');
//   const [fwSignature, setFwSignature] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchConfigCatalog = async () => {
//       try {
//         const data = await getCatalogList('config-catalog');
//         setConfigCatalog(data);
//       } catch (error) {
//         console.error('Error fetching Config Catalog:', error);
//       }
//     };
//     fetchConfigCatalog();
//   }, []);

//   const handleAddFile = () => {
//     const newFileUpload = { id: fileUploads.length + 1, file: null };
//     setFileUploads([...fileUploads, newFileUpload]);
//   };

//   const handleRemoveFile = (id) => {
//     setFileUploads(fileUploads.filter((file) => file.id !== id));
//   };

//   const handleFileChange = (index, event) => {
//     const selectedFile = event.target.files[0];
//     const updatedFileUploads = fileUploads.map((fileUpload) =>
//       fileUpload.id === index ? { ...fileUpload, file: selectedFile } : fileUpload
//     );
//     setFileUploads(updatedFileUploads);
//   };

//   // Request presigned URL and upload file to S3 with metadata
//   const uploadFile = async (file) => {
//     try {
//       // Request presigned URL from backend with metadata
//       const response = await axios.post('/api/files/presigned-urls', [
//         {
//           ecuName: selectedECU,
//           configId: selectedConfigId,
//           vendorName,
//           vehicleModel: selectedVehicleModel,
//           vehicleVariant,
//           releaseVersion,
//           hwPartNumber,
//           communicationProtocol,
//           securityMethod,
//           securityLevel,
//           fwSignature,
//           fileName: file.name,
//           contentType: file.type,
//         },
//       ]);

//       const presignedUrl = response.data[0]?.url;

//       if (!presignedUrl) {
//         console.error('Presigned URL not received');
//         return;
//       }

//       // Upload file to S3 using presigned URL
//       await axios.put(presignedUrl, file, {
//         headers: { 'Content-Type': file.type },
//       });

//       console.log(`File ${file.name} uploaded successfully`);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     for (const fileUpload of fileUploads) {
//       if (fileUpload.file) {
//         await uploadFile(fileUpload.file);
//       }
//     }
//     console.log('All files uploaded');
//   };

//    // Define handleCancel to navigate back to the main page
//    const handleCancel = () => {
//     navigate('/');
//   };

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8">SW Catalog</h1>

//       <div className="border rounded-lg p-8 bg-white shadow-md">
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block font-semibold mb-2">Select ECU</label>
//             <select
//               className="w-full border border-gray-300 rounded p-2"
//               value={selectedECU}
//               onChange={(e) => setSelectedECU(e.target.value)}
//             >
//               <option value="">Select ECU</option>
//               {configCatalog.map((item) => (
//                 <option key={item.ecuName} value={item.ecuName}>
//                   {item.ecuName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">Select Config ID</label>
//             <select
//               className="w-full border border-gray-300 rounded p-2"
//               value={selectedConfigId}
//               onChange={(e) => setSelectedConfigId(e.target.value)}
//             >
//               <option value="">Select Config ID</option>
//               {configCatalog
//                 .filter((item) => item.ecuName === selectedECU)
//                 .map((item) => (
//                   <option key={item.configId} value={item.configId}>
//                     {item.configId}
//                   </option>
//                 ))}
//             </select>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Vendor Name</label>
//           <select
//             className="w-full border border-gray-300 rounded p-2"
//             value={vendorName}
//             onChange={(e) => setVendorName(e.target.value)}
//           >
//             <option value="">Select Vendor</option>
//             <option value="vendor1">Vendor 1</option>
//             <option value="vendor2">Vendor 2</option>
//             <option value="vendor3">Vendor 3</option>
//           </select>
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Vehicle Model</label>
//           <div className="flex items-center">
//             <input
//               type="radio"
//               id="harrier"
//               name="vehicleModel"
//               value="Harrier"
//               className="mr-2"
//               onChange={(e) => setSelectedVehicleModel(e.target.value)}
//             />
//             <label htmlFor="harrier" className="mr-4">Harrier</label>

//             <input
//               type="radio"
//               id="safari"
//               name="vehicleModel"
//               value="Safari"
//               className="mr-2"
//               onChange={(e) => setSelectedVehicleModel(e.target.value)}
//             />
//             <label htmlFor="safari" className="mr-4">Safari</label>

//             <input
//               type="radio"
//               id="curvv"
//               name="vehicleModel"
//               value="Curvv"
//               className="mr-2"
//               onChange={(e) => setSelectedVehicleModel(e.target.value)}
//             />
//             <label htmlFor="curvv" className="mr-4">Curvv</label>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Vehicle Variant</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., A1/XZ/AMA/Sport"
//             value={vehicleVariant}
//             onChange={(e) => setVehicleVariant(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">SW Release Version</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., 1.0"
//             value={releaseVersion}
//             onChange={(e) => setReleaseVersion(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">HW Part Number</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., HW_123456"
//             value={hwPartNumber}
//             onChange={(e) => setHwPartNumber(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Communication Protocol</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., CAN"
//             value={communicationProtocol}
//             onChange={(e) => setCommunicationProtocol(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Security Method</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., Method_A"
//             value={securityMethod}
//             onChange={(e) => setSecurityMethod(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Security Level</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., Level_1"
//             value={securityLevel}
//             onChange={(e) => setSecurityLevel(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Firmware Signature</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., Signature_123"
//             value={fwSignature}
//             onChange={(e) => setFwSignature(e.target.value)}
//           />
//         </div>

//         <h2 className="text-xl font-semibold mb-4">File Uploads</h2>
//         {fileUploads.map((fileUpload) => (
//           <div key={fileUpload.id} className="mb-4 flex items-center">
//             <input
//               type="file"
//               onChange={(event) => handleFileChange(fileUpload.id, event)}
//               className="mr-4"
//             />
//             <button
//               type="button"
//               onClick={() => handleRemoveFile(fileUpload.id)}
//               className="bg-red-500 text-white px-4 py-2 rounded"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={handleAddFile}
//           className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
//         >
//           Add More Files
//         </button>

//         <div className="flex justify-between">
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="bg-gray-500 text-white px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleSubmit}
//             className="bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Upload
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;



// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCatalogListByCatalogueId } from '../services/apiService';
// import axios from 'axios';

// const UploadPage = () => {
//   // Existing state variables
//   const [fileUploads, setFileUploads] = useState([{ id: 1, file: null }]);
//   const [configCatalog, setConfigCatalog] = useState([]);
//   const [selectedECU, setSelectedECU] = useState('');
//   const [selectedConfigId, setSelectedConfigId] = useState('');
//   const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
//   const [vendorName, setVendorName] = useState('');
//   const [vehicleVariant, setVehicleVariant] = useState('');
//   const [releaseVersion, setReleaseVersion] = useState('');
//   const [hwPartNumber, setHwPartNumber] = useState('');
//   const [communicationProtocol, setCommunicationProtocol] = useState('');
//   const [securityMethod, setSecurityMethod] = useState('');
//   const [securityLevel, setSecurityLevel] = useState('');
//   const [fwSignature, setFwSignature] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(false);
//   const [swVersion, setSwVersion] = useState(''); // Change function name to setSwVersion
//   const [catalogType, setCatalogType] = useState('SW_Catalogue'); // New state for catalog type
//   const navigate = useNavigate();
  
//   // useEffect(() => {
//   //   const fetchConfigCatalog = async () => {
//   //     try {
//   //       const data = await getCatalogListByCatalogueId('sw-catalog'); // Ensure this is the correct catalog identifier
//   //       setData(data); // Assuming `setData` is the state setter for your catalog data
//   //     } catch (error) {
//   //       console.error('Error fetching Config Catalog:', error);
//   //     }
//   //   };
//   //   fetchConfigCatalog();
//   // }, []);
  

//   const handleAddFile = () => {
//     setFileUploads([...fileUploads, { id: fileUploads.length + 1, file: null }]);
//   };

//   const handleRemoveFile = (id) => {
//     setFileUploads(fileUploads.filter((file) => file.id !== id));
//   };

//   const handleFileChange = (index, event) => {
//     const selectedFile = event.target.files[0];
//     setFileUploads(fileUploads.map((upload) => (upload.id === index ? { ...upload, file: selectedFile } : upload)));
//   };

//   const requestPresignedUrls = async () => {
//     try {
//       const metadataPayload = [
//         {
//           catalogueType: catalogType,
//           ecuName: selectedECU,
//           releaseVersion,
//           configVersion: swVersion,
//           vendorName,
//           vehicleModel: selectedVehicleModel,
//           vehicleVariant,
//           files: fileUploads.map((upload) => upload.file?.name).filter(Boolean),
//         }
//       ];
  
//       const response = await axios.post(
//         'http://localhost:8080/api/catalogue_items/presigned_urls',
//         metadataPayload
//       );
  
//       console.log('Received presigned URLs:', response.data);
//       return response.data; // Array of presigned URLs
//     } catch (error) {
//       console.error('Error requesting presigned URLs:', error);
//       alert('Error requesting presigned URLs. Please try again.');
//       return [];
//     }
//   };

//   const uploadFileToS3 = async (file, presignedUrl) => {
//     try {
//       const response = await axios.put(presignedUrl, file, {
//         headers: {
//           'Content-Type': file.type,
//         },
//       });
//       console.log(`File ${file.name} uploaded successfully`, response);
//     } catch (error) {
//       console.error(`Error uploading file ${file.name}:`, error);
//       throw error;
//     }
//   };

//   // const uploadFileToS3 = async (file) => {
//   //   try {
//   //     // Request presigned URL from your backend
//   //     const response = await axios.post('http://localhost:4000/generate-presigned-url', {
//   //       fileName: file.name,
//   //       fileType: file.type
//   //     });
      
//   //     const { url } = response.data;
  
//   //     // Use the presigned URL to upload the file to S3
//   //     await axios.put(url, file, {
//   //       headers: {
//   //         'Content-Type': file.type,
//   //       },
//   //     });
  
//   //     console.log(`File ${file.name} uploaded successfully`);
//   //   } catch (error) {
//   //     console.error(`Error uploading file ${file.name}:`, error);
//   //     throw error;
//   //   }
//   // };
  

//   const handleSubmit = async () => {
//     if (!selectedECU || !vendorName || !releaseVersion || !swVersion) {
//       alert('Please fill in all required fields.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const presignedUrls = await requestPresignedUrls();

//       const uploadPromises = fileUploads.map((upload, index) => {
//         const presignedUrl = presignedUrls[index]?.presignedUrl;
//         if (upload.file && presignedUrl) {
//           return uploadFileToS3(upload.file, presignedUrl);
//         }
//         return Promise.resolve();
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

//   const handleCancel = () => {
//     navigate('/');
//   };

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8">SW Catalog</h1>

//       <div className="border rounded-lg p-8 bg-white shadow-md">
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block font-semibold mb-2">Catalog Type</label>
//             <select
//               className="w-full border border-gray-300 rounded p-2"
//               value={catalogType}
//               onChange={(e) => setCatalogType(e.target.value)}
//             >
//               <option value="SW_Catalogue">SW Catalogue</option>
//               <option value="HW_Catalogue">HW Catalogue</option>
//             </select>
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">Select ECU</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded p-2"
//               placeholder="Enter ECU Name"
//               value={selectedECU}
//               onChange={(e) => setSelectedECU(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Vendor Name</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="Enter Vendor Name"
//             value={vendorName}
//             onChange={(e) => setVendorName(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Vehicle Model</label>
//           <div className="flex items-center">
//             {['Harrier', 'Safari', 'Curvv'].map((model) => (
//               <div key={model} className="mr-4">
//                 <input
//                   type="radio"
//                   id={model.toLowerCase()}
//                   name="vehicleModel"
//                   value={model}
//                   className="mr-2"
//                   onChange={(e) => setSelectedVehicleModel(e.target.value)}
//                 />
//                 <label htmlFor={model.toLowerCase()}>{model}</label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Vehicle Variant</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., A1/XZ/AMA/Sport"
//             value={vehicleVariant}
//             onChange={(e) => setVehicleVariant(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">SW Release Version</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., 1.0"
//             value={releaseVersion}
//             onChange={(e) => setReleaseVersion(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block font-semibold mb-2">SW Version</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 rounded p-2"
//             placeholder="e.g., 1.0"
//             value={swVersion}
//             onChange={(e) => setSwVersion(e.target.value)}
//           />
//         </div>

//         {fileUploads.map((upload) => (
//           <div key={upload.id} className="mb-6">
//             <label className="block font-semibold mb-2">Upload File {upload.id}</label>
//             <input
//               type="file"
//               accept="*/*"
//               onChange={(e) => handleFileChange(upload.id, e)}
//               className="border border-gray-300 rounded p-2"
//             />
//             <button
//               type="button"
//               onClick={() => handleRemoveFile(upload.id)}
//               className="ml-4 text-red-500"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
        
//         <button
//           type="button"
//           onClick={handleAddFile}
//           className="text-blue-500 mb-6"
//         >
//           Add Another File
//         </button>

//         <div className="flex justify-between">
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             {loading ? 'Uploading...' : 'Upload Files'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;

























// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import CryptoJS from 'crypto-js';

// const UploadPage = () => {
//   const [fileUploads, setFileUploads] = useState([{ id: 1, file: null, md5Hash: null }]);
//   const [selectedECU, setSelectedECU] = useState('');
//   const [vendorName, setVendorName] = useState('');
//   const [vehicleModel, setVehicleModel] = useState('');
//   const [vehicleVariant, setVehicleVariant] = useState('');
//   const [releaseVersion, setReleaseVersion] = useState('');
//   const [swVersion, setSwVersion] = useState('');
//   const [hwPartNumber, setHwPartNumber] = useState('');
//   const [communicationProtocol, setCommunicationProtocol] = useState('');
//   const [securityMethod, setSecurityMethod] = useState('');
//   const [securityLevel, setSecurityLevel] = useState('');
//   const [fwSignature, setFwSignature] = useState('');
//   const [upload, setUploadType] = useState('');
//   const [catalogType, setCatalogType] = useState('SW_Catalogue');
//   const [configId, setConfigId] = useState('');
//   const [configOptions, setConfigOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [partitions, setPartitions] = useState([
//     { id: Date.now(), swType: '', fileFormat: '', file: null, version: '' }
//   ]);

//   const handleFileChange = (index, event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
//         const md5Hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray)); // Base64 encoded MD5 hash
  
//         setFileUploads((prevUploads) =>
//           prevUploads.map((upload) =>
//             upload.id === index
//               ? { ...upload, file: selectedFile, md5Hash, fileType: selectedFile.type, fileSize: selectedFile.size }
//               : upload
//           )
//         );
//       };
//       reader.readAsArrayBuffer(selectedFile);
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
  

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const UploadPage = () => {
  //const [fileUploads, setFileUploads] = useState([{ id: 1, file: null, md5Hash: null }]);
  const [selectedECU, setSelectedECU] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleVariant, setVehicleVariant] = useState('');
  const [releaseVersion, setReleaseVersion] = useState('');
  const [swVersion, setSwVersion] = useState('');
  const [hwPartNumber, setHwPartNumber] = useState('');
  // const [communicationProtocol, setCommunicationProtocol] = useState('');
  // const [securityMethod, setSecurityMethod] = useState('');
  const [securityLevel, setSecurityLevel] = useState('');
  const [fwSignature, setFwSignature] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [catalogType, setCatalogType] = useState('SW_Catalogue');
  const [configId, setConfigId] = useState('');
  const [configOptions, setConfigOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [partitions, setPartitions] = useState([
    { id: 1, fileFormat: 'Binary', version: '', file: null, md5Hash: null, fileType: '', fileSize: 0 }
  ]);
  

  // const handleFileChange = (index, event, value) => {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
  //       const md5Hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray)); // Base64 encoded MD5 hash
  
  //       setFileUploads((prevUploads) =>
  //         prevUploads.map((upload) =>
  //           upload.id === index
  //             ? { ...upload, file: selectedFile, md5Hash, fileType: selectedFile.type, fileSize: selectedFile.size }
  //             : upload
  //         )
  //       );
  //     };
  //     reader.readAsArrayBuffer(selectedFile);
  //   }
  // };

  const handleFileChange = (id, field, value) => {
    setPartitions((prevPartitions) =>
      prevPartitions.map((partition) =>
        partition.id === id ? { ...partition, [field]: value } : partition
      )
    );

    if (field === 'file') {
      const selectedFile = value;
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
          const md5Hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray)); // Base64 encoded MD5 hash

          setPartitions((prevPartitions) =>
            prevPartitions.map((partition) =>
              partition.id === id
                ? {
                    ...partition,
                    file: selectedFile,
                    md5Hash,
                    fileType: selectedFile.type,
                    fileSize: selectedFile.size
                  }
                : partition
            )
          );
        };
        reader.readAsArrayBuffer(selectedFile);
      }
    }
  };

  
  const handleRemovePartition = (id) => {
    setPartitions((prevPartitions) => prevPartitions.filter((partition) => partition.id !== id));
  };

  // const handleRemoveFile = (id) => {
  //   setPartitions((prevPartitions) => prevPartitions.filter((partition) => partition.id !== id));
  // };

  const handleAddPartition = () => {
    setPartitions((prevPartitions) => [
      ...prevPartitions,
      { id: prevPartitions.length + 1, fileFormat: 'Binary', version: '', file: null, md5Hash: null, fileType: '', fileSize: 0 }
    ]);
  };

  // const requestPresignedUrls = async () => {
  //   try {
  //     // Constructing the payload
  //     const metadataPayload = {
  //       catalogType, 
  //       ecuName: selectedECU,
  //       releaseVersion,
  //       configVersion: swVersion,
  //       vendorName,
  //       vehicleModel,
  //       vehicleVariant,
  //       securityInfo: {
  //         //securityMethod,
  //         securityLevel,
  //         fwSignature,
  //       },
  //       fileMetadata: fileUploads
  //         .filter((upload) => upload.file) // Only include selected files
  //         .map((upload) => ({
  //           fileName: upload.file.name,
  //           fileType: upload.fileType,
  //           fileSize: upload.fileSize,
  //           md5: upload.md5Hash,
  //           status: 'pending', // Initial status
  //         })),
  //     };

  //     const response = await axios.post(
  //       'http://localhost:8080/api/catalogue_items/presigned_urls',
  //       metadataPayload
  //     );

  //     console.log('Received presigned URLs:', response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error requesting presigned URLs:', error);
  //     alert('Error requesting presigned URLs. Please try again.');
  //     return [];
  //   }
  // };



  const requestPresignedUrls = async () => {
    try {
      const metadataPayload = {
        catalogType,
        ecuName: selectedECU,
        releaseVersion,
        configVersion: swVersion,
        vendorName,
        vehicleModel,
        vehicleVariant,
        securityInfo: {
          securityLevel,
          fwSignature,
        },
        fileMetadata: partitions
          .filter((partition) => partition.file) // Only include selected files
          .map((partition) => ({
            fileName: partition.file.name,
            fileType: partition.fileType,
            fileSize: partition.fileSize,
            md5: partition.md5Hash,
            status: 'pending', // Initial status
          })),
      };

      const response = await axios.post(
        'http://localhost:8080/api/catalogue_items/presigned_urls',
        metadataPayload
      );

      console.log('Received presigned URLs:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error requesting presigned URLs:', error);
      alert('Error requesting presigned URLs. Please try again.');
      return [];
    }
  };
  

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await requestPresignedUrls();
  //     const presignedUrls = response.presignedUrlList; // Access presignedUrlList from response
  //     const uploadPromises = fileUploads.map(async (upload, index) => {
  //       const presignedData = presignedUrls[index];
        
  //       if (upload.file && presignedData?.presignedUrl) {
  //         try {
  //           console.log(`Starting upload for ${upload.file.name}`);
  //           await uploadFileToS3(upload.file, presignedData.presignedUrl, presignedData['Content-MD5']);
  //           await updateFileStatus(presignedData['MD5'], 'uploaded');
  //         } catch (error) {
  //           await updateFileStatus(presignedData['MD5'], 'failed');
  //           alert(`Upload failed for ${upload.file.name}: ${error.message}`);
  //         }
  //       }
  //     });
  
  //     await Promise.all(uploadPromises);
  //     alert('All files uploaded successfully');
  //   } catch (error) {
  //     console.error('Error during file upload:', error);
  //     alert('Error during file upload. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await requestPresignedUrls();
      const presignedUrls = response.presignedUrlList; // Access presignedUrlList from response
      const uploadPromises = partitions.map(async (partition, index) => {
        const presignedData = presignedUrls[index];
        
        if (partition.file && presignedData?.presignedUrl) {
          try {
            console.log(`Starting upload for ${partition.file.name}`);
            await uploadFileToS3(partition.file, presignedData.presignedUrl, presignedData['Content-MD5']);
            await updateFileStatus(presignedData['MD5'], 'uploaded');
          } catch (error) {
            await updateFileStatus(presignedData['MD5'], 'failed');
            alert(`Upload failed for ${partition.file.name}: ${error.message}`);
          }
        }
      });
  
      await Promise.all(uploadPromises);
      alert('All files uploaded successfully');
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('Error during file upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const uploadFileToS3 = async (file, presignedUrl, contentMD5) => {
    try {
      const response = await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
          'Content-MD5': contentMD5,
        },
      });
      console.log(`File ${file.name} uploaded successfully`, response);
      return 'uploaded';
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }
  };
  
  
  
  
  
  const updateFileStatus = async (md5Hash, status) => {
    try {
      await axios.get('http://localhost:8080/api/catalogue_items/check-status', { params: { md5Hash, status } });

      console.log(`Status "${status}" for MD5 "${md5Hash}" sent successfully.`);
    } catch (error) {
      console.error('Error updating file status:', error);
    }
  };

  // Function to generate random config IDs
  const generateConfigOptions = () => {
    const options = [];
    for (let i = 0; i < 4; i++) {
      const randomString = `ID-${Math.random().toString(36).substring(2, 8)}-${Math.floor(Math.random() * 1000)}`;
      options.push(randomString);
    }
    setConfigOptions(options);
  };
  

  const handleSaveDraft = () => {
    console.log('Draft saved');
    // Add your save draft functionality here
  };

  return (
      // <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      //   <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700">SW Catalog</h1>
      //   <div className="border rounded-lg p-8 bg-white shadow-lg">  
    
      //     {/* Form Fields */}
      //     <div className="grid grid-cols-2 gap-6 mb-6">
      //       <div>
      //         <label className="block font-medium mb-2 text-gray-700">Catalog Type</label>
      //         <select
      //           className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //           value={catalogType}
      //           onChange={(e) => setCatalogType(e.target.value)}
      //         >
      //           <option value="SW_Catalogue">SW Catalogue</option>
      //         </select>
      //       </div>
      //       <div>
      //         <label className="block font-medium mb-2 text-gray-700">Select ECU</label>
      //         <select
      //           className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //           value={selectedECU}
      //           onChange={(e) => setSelectedECU(e.target.value)}
      //         >
      //           <option value="" disabled>Select ECU</option>
      //           <option value="BCM">BCM</option>
      //           <option value="FATC">FATC</option>
      //           <option value="CCM">CCM</option>
      //           <option value="MCU">MCU</option>
      //           <option value="CCH">CCH</option>
      //           <option value="DCS">DCS</option>
      //           <option value="DMS">DMS</option>
      //           <option value="DSM">DSM</option>
      //           <option value="EMS">EMS</option>
      //           <option value="EPAS">EPAS</option>
      //         </select>
      //       </div>
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">Config ID</label>
      //       <select
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         value={configId}
      //         onChange={(e) => setConfigId(e.target.value)}
      //         onClick={generateConfigOptions}
      //       >
      //         <option value="" disabled>Select Config ID</option>
      //         {configOptions.map((option, index) => (
      //           <option key={index} value={option}>{option}</option>
      //         ))}
      //       </select>
      //     </div>
    
      //     {/* Additional Form Fields */}
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">Vendor Name</label>
      //       <input
      //         type="text"
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         placeholder="BOSCH/APTIVE"
      //         value={vendorName}
      //         onChange={(e) => setVendorName(e.target.value)}
      //       />
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">Vehicle Model</label>
      //       <div className="border rounded-lg p-3">
      //         <label className="block">
      //           <input
      //             type="radio"
      //             value="Harrier"
      //             checked={vehicleModel === "Harrier"}
      //             onChange={(e) => setVehicleModel(e.target.value)}
      //             className="mr-2"
      //           />
      //           Harrier
      //         </label>
      //         <label className="block">
      //           <input
      //             type="radio"
      //             value="Safari"
      //             checked={vehicleModel === "Safari"}
      //             onChange={(e) => setVehicleModel(e.target.value)}
      //             className="mr-2"
      //           />
      //           Safari
      //         </label>
      //         <label className="block">
      //           <input
      //             type="radio"
      //             value="Curvv"
      //             checked={vehicleModel === "Curvv"}
      //             onChange={(e) => setVehicleModel(e.target.value)}
      //             className="mr-2"
      //           />
      //           Curvv
      //         </label>
      //       </div>
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">Vehicle Variant</label>
      //       <input
      //         type="text"
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         placeholder="A11/XZ+/XMA/SPORT"
      //         value={vehicleVariant}
      //         onChange={(e) => setVehicleVariant(e.target.value)}
      //       />
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">SW Release Version</label>
      //       <input
      //         type="text"
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         placeholder="e.g., 1.0"
      //         value={releaseVersion}
      //         onChange={(e) => setReleaseVersion(e.target.value)}
      //       />
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">SW Version</label>
      //       <input
      //         type="text"
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         placeholder="e.g., 1.0"
      //         value={swVersion}
      //         onChange={(e) => setSwVersion(e.target.value)}
      //       />
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">HW Part Number</label>
      //       <input
      //         type="text"
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         placeholder="e.g., HW_123456"
      //         value={hwPartNumber}
      //         onChange={(e) => setHwPartNumber(e.target.value)}
      //       />
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">Communication Protocol</label>
      //       <input
      //         type="text"
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         placeholder="UDS/ETH"
      //         value={communicationProtocol}
      //         onChange={(e) => setCommunicationProtocol(e.target.value)}
      //       />
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">Security Method</label>
      //       <input
      //         type="text"
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         value={securityMethod}
      //         onChange={(e) => setSecurityMethod(e.target.value)}
      //       />
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">Security Level</label>
      //       <input
      //         type="text"
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         value={securityLevel}
      //         onChange={(e) => setSecurityLevel(e.target.value)}
      //       />
      //     </div>
    
      //     <div className="mb-6">
      //       <label className="block font-medium mb-2 text-gray-700">Firmware Signature</label>
      //       <input
      //         type="text"
      //         className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
      //         value={fwSignature}
      //         onChange={(e) => setFwSignature(e.target.value)}
      //       />
      //     </div>
    
      //     {/* File Upload Section */}
      //     {fileUploads.map((upload) => (
      //       <div key={upload.id} className="mb-6">
      //         <label className="block font-medium mb-2 text-gray-700">Upload File {upload.id}</label>
      //         <input
      //           type="file"
      //           accept="*/*"
      //           onChange={(e) => handleFileChange(upload.id, e)}
      //           className="border border-gray-300 rounded-lg p-3 focus:outline-none transition"
      //         />
      //         <button
      //           type="button"
      //           onClick={() => handleRemoveFile(upload.id)}
      //           className="ml-2 bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600 transition"
      //         >
      //           Remove
      //         </button>
      //       </div>
      //     ))}
      //     <button
      //       type="button"
      //       onClick={handleAddFile}
      //       className="bg-blue-500 text-white rounded-lg px-4 py-2 mb-6 hover:bg-blue-600 transition"
      //     >
      //       Add More Files
      //     </button>
    
      //     {/* Submit and Cancel */}
      //     <div className="flex justify-between">
      //       <button
      //         onClick={handleSubmit}
      //         disabled={loading}
      //         className={`bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      //       >
      //         {loading ? 'Uploading...' : 'Submit'}
      //       </button>
      //       <button
      //         onClick={() => navigate('/')}
      //         className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition"
      //       >
      //         Cancel
      //       </button>
      //     </div>
      //   </div>
      // </div>
<div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">SW Catalog</h1>
      <div className="border rounded-lg p-4 bg-white shadow-lg overflow-x-auto">
        
        {/* First Row with Black Border */}
        <div className="grid grid-cols-4 gap-2 border border-black p-2 mb-4">
          {/* Select ECU */}
          <div>
            <label className="block font-bold mb-1 text-black text-xs">Select ECU</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition bg-yellow-400"
              value={selectedECU}
              onChange={(e) => setSelectedECU(e.target.value)}
            >
              <option value="" disabled>Select ECU</option>
              <option value="BCM">BCM</option>
              <option value="FATC">FATC</option>
              <option value="CCM">CCM</option>
              {/* Add other options here */}
            </select>
          </div>

          {/* Vendor Name */}
          <div>
            <label className="block font-bold mb-1 text-black text-xs">Vendor Name</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition bg-yellow-400"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            >
            <option value="" disabled>Select Vendor</option>
            <option value="BOSCH">BOSCH</option>
            <option value="APTIVE">APTIVE</option>
            <option value="Hella">Hella</option>
            <option value="Harman">Harman</option>
          </select>
        </div>


          {/* Vehicle Model */}
          <div>
            <label className="block font-bold mb-1 text-black text-xs">Vehicle Model</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition bg-yellow-400"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
            >
              <option value="Harrier">Harrier</option>
              <option value="Safari">Safari</option>
              <option value="Curvv">Curvv</option>
              <option value="Curvv">Punch</option>
              <option value="Curvv">Nexon</option>
            </select>
          </div>

          {/* Vehicle Variant */}
          <div>
            <label className="block font-bold mb-1 text-black text-xs">Vehicle Variant</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
              placeholder="A11/XZ+/XMA/SPORT"
              value={vehicleVariant}
              onChange={(e) => setVehicleVariant(e.target.value)}
            />
          </div>
        </div>

        {/* Second Row with Black Border */}
        <div className="grid grid-cols-5 gap-2 border border-black p-2 mb-4">
          {/* Config ID */}
          <div>
            <label className="block font-bold mb-1 text-black text-xs">Config ID</label>
            <select
               className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition bg-yellow-400"
               value={configId}
               onChange={(e) => setConfigId(e.target.value)}
               onClick={generateConfigOptions}
             >
               <option value="" disabled>Select Config ID</option>
               {configOptions.map((option, index) => (
                 <option key={index} value={option}>{option}</option>
               ))}
             </select>
          </div>

          {/* SW Release Version */}
          <div>
            <label className="block font-bold mb-1 text-black text-xs">SW Release Version</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
              placeholder="e.g., 1.0"
              value={releaseVersion}
              onChange={(e) => setReleaseVersion(e.target.value)}
            />
          </div>

          {/* SW Version */}
          <div>
            <label className="block font-bold mb-1 text-black text-xs">SW Version</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
              placeholder="e.g., 1.0"
              value={swVersion}
              onChange={(e) => setSwVersion(e.target.value)}
            />
          </div>

          {/* HW Part Number */}
          <div>
            <label className="block font-bold mb-1 text-black text-xs">HW Part Number</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
              placeholder="e.g., HW_123456"
              value={hwPartNumber}
              onChange={(e) => setHwPartNumber(e.target.value)}
            />
          </div>

          {/* Select Upload Type */}
          <div>
            <label className="block font-bold mb-1 text-black text-xs">Select Upload Type</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition bg-yellow-400"
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
            >
              <option value="" disabled>Select Upload Type</option>
              <option value="Full Binary">Full Binary</option>
              <option value="Incremental Update">Prepared Data</option>
              {/* Add other options here */}
            </select>
          </div>
        </div>

        {/* Security Access Section */}
        <div className="mb-6 border border-black p-3 rounded-md">
          <label className="block font-medium text-gray-700 text-sm mb-2">Security Access</label>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block font-bold mb-1 text-black text-xs">Security Level</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block font-bold mb-1 text-black text-xs">Firmware Signature</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
                value={fwSignature}
                onChange={(e) => setFwSignature(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="mb-6 border border-black p-3 rounded-md">
        {partitions.map((partition, index) => (
  <div key={partition.id} className="grid grid-cols-6 gap-2 items-center">
    {/* SW Type */}
    <div>
      <label className="block font-bold mb-1 text-black text-xs">SW Type</label>
              <select
                 className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition bg-yellow-400"
                 value={catalogType}
                 onChange={(e) => setCatalogType(e.target.value)}
               >
               <option value="SW Catalogue">SW Catalogue</option>
               
             </select>
    </div>
    
    {/* File Format */}
    <div>
      <label className="block font-bold mb-1 text-black text-xs">File Format</label>
      <select
        className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition bg-yellow-400"
        value={partition.fileFormat}
        onChange={(e) => handleFileChange(partition.id, 'fileFormat', e.target.value)}
      >
        <option value="Binary">.bin</option>
        <option value="Hex">.hex</option>
        <option value="ELF">.s</option>
      </select>
    </div>

          {/* File Upload */}
          <div>
                <label className="block font-bold mb-1 text-black text-xs">Upload File {partition.id}</label>
                <input
                  type="file"
                  accept="*/*"
                  onChange={(e) => handleFileChange(partition.id, 'file', e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition bg-blue-400"
                />
              </div>
        
    
  


    {/* Version */}
    <div>
      <label className="block font-bold mb-1 text-black text-xs">Version</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
        value={partition.version}
        onChange={(e) => handleFileChange(partition.id, 'version', e.target.value)}
      />
    </div>

    {/* Conditional Fields for .bin File Format */}
    {partition.fileFormat === 'Binary' && (
      <>
        {/* Start Address */}
        <div>
          <label className="block font-bold mb-1 text-black text-xs">Start Address</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
            placeholder="e.g., 0x0000"
            value={partition.startAddress || ''}
            onChange={(e) => handleFileChange(partition.id, 'startAddress', e.target.value)}
          />
        </div>

        {/* Compressed Bytes */}
        <div>
          <label className="block font-bold mb-1 text-black text-xs">Compressed Bytes</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
            placeholder="e.g., 1024"
            value={partition.compressedBytes || ''}
            onChange={(e) => handleFileChange(partition.id, 'compressedBytes', e.target.value)}
          />
        </div>

        {/* Uncompressed Bytes */}
        <div>
          <label className="block font-bold mb-1 text-black text-xs">Uncompressed Bytes</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-1 text-xs focus:ring focus:ring-blue-300 focus:outline-none transition"
            placeholder="e.g., 2048"
            value={partition.uncompressedBytes || ''}
            onChange={(e) => handleFileChange(partition.id, 'uncompressedBytes', e.target.value)}
          />
        </div>
      </>
    )}
  

              {/* Add/Remove Buttons */}
              <div className="flex space-x-1 justify-center">
                {index === partitions.length - 1 && (
                  <button
                    onClick={handleAddPartition}
                    className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-3 py-1 text-xs"
                  >
                    Add
                  </button>
                )}
                {partitions.length > 1 && (
                  <button
                    onClick={() => handleRemovePartition(partition.id)}
                    className="text-white bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>


            </div>
          ))}
        </div>
        </div>
        {/* Buttons Section (Right-Aligned) */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleSaveDraft}
            className="bg-gray-300 text-gray-700 py-1 px-3 rounded-lg text-xs hover:bg-gray-400 transition"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white py-1 px-3 rounded-lg text-xs hover:bg-blue-700 transition"
          >
            {loading ? 'Uploading...' : 'Submit'}
            </button>
            <button
             onClick={() => navigate('/')}
             className="bg-gray-300 text-gray-700 py-1 px-3 rounded-lg text-xs hover:bg-gray-400 transition"
           >
             Cancel
           </button>
        </div>
      </div>
    









  );
  
};

export default UploadPage;







// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import CryptoJS from 'crypto-js';

// const UploadPage = () => {
//   const [fileUploads, setFileUploads] = useState([{ id: 1, file: null, md5Hash: null }]);
//   const [selectedECU, setSelectedECU] = useState('');
//   const [vendorName, setVendorName] = useState('');
//   const [vehicleModel, setVehicleModel] = useState('');
//   const [vehicleVariant, setVehicleVariant] = useState('');
//   const [releaseVersion, setReleaseVersion] = useState('');
//   const [swVersion, setSwVersion] = useState('');
//   const [catalogType, setCatalogType] = useState('SW_Catalogue');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleFileChange = (index, event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
//         const md5Hash = CryptoJS.MD5(wordArray).toString();

//         setFileUploads((prevUploads) =>
//           prevUploads.map((upload) =>
//             upload.id === index
//               ? { ...upload, file: selectedFile, md5Hash, fileType: selectedFile.type, fileSize: selectedFile.size }
//               : upload
//           )
//         );
//       };
//       reader.readAsArrayBuffer(selectedFile);
//     }
//   };

//   const handleRemoveFile = (id) => {
//     setFileUploads((prevUploads) => prevUploads.filter((upload) => upload.id !== id));
//   };

//   const handleAddFile = () => {
//     setFileUploads((prevUploads) => [...prevUploads, { id: prevUploads.length + 1, file: null, md5Hash: null }]);
//   };

//   const requestPresignedUrls = async (md5) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/catalogue_items/presigned_urls?md5=${md5}`
//       );
//       console.log('Received presigned URL:', response.data);
//       return response.data.presignedUrl;  // Assuming the backend returns the presigned URL.
//     } catch (error) {
//       console.error('Error requesting presigned URL:', error);
//       alert('Error requesting presigned URL. Please try again.');
//       return null;
//     }
//   };

//   const uploadFileToS3 = async (file, presignedUrl) => {
//     try {
//       const response = await axios.put(presignedUrl, file, {
//         headers: {
//           'Content-Type': file.type,
//         },
//       });
//       console.log(`File ${file.name} uploaded successfully`, response);
//       return 'uploaded';
//     } catch (error) {
//       console.error(`Error uploading file ${file.name}:`, error);
//       throw new Error(`Failed to upload ${file.name}: ${error.message}`);
//     }
//   };

//   const updateFileStatus = async (md5, status) => {
//     try {
//       await axios.get('http://localhost:8080/api/catalogue_items/check-status', { params: { md5, status } });
//       console.log(`Status "${status}" for MD5 "${md5}" sent successfully.`);
//     } catch (error) {
//       console.error('Error updating file status:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const uploadPromises = fileUploads.map(async (upload) => {
//         const presignedUrl = await requestPresignedUrls(upload.md5Hash);
//         if (upload.file && presignedUrl) {
//           try {
//             await uploadFileToS3(upload.file, presignedUrl);
//             await updateFileStatus(upload.md5Hash, 'uploaded');
//           } catch (error) {
//             await updateFileStatus(upload.md5Hash, 'failed');
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
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8">SW Catalog</h1>
//       <div className="border rounded-lg p-8 bg-white shadow-md">
//         {/* Form Fields */}
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block font-semibold mb-2">Catalog Type</label>
//             <select
//               className="w-full border border-gray-300 rounded p-2"
//               value={catalogType}
//               onChange={(e) => setCatalogType(e.target.value)}
//             >
//               <option value="SW_Catalogue">SW Catalogue</option>
//             </select>
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">Select ECU</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded p-2"
//               placeholder="Enter ECU Name"
//               value={selectedECU}
//               onChange={(e) => setSelectedECU(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block font-semibold mb-2">Vendor Name</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded p-2"
//               placeholder="Enter Vendor Name"
//               value={vendorName}
//               onChange={(e) => setVendorName(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">Vehicle Model</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded p-2"
//               placeholder="Enter Vehicle Model"
//               value={vehicleModel}
//               onChange={(e) => setVehicleModel(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">Vehicle Variant</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded p-2"
//               placeholder="Enter Vehicle Variant"
//               value={vehicleVariant}
//               onChange={(e) => setVehicleVariant(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">Release Version</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded p-2"
//               placeholder="Enter Release Version"
//               value={releaseVersion}
//               onChange={(e) => setReleaseVersion(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">SW Version</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded p-2"
//               placeholder="Enter SW Version"
//               value={swVersion}
//               onChange={(e) => setSwVersion(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* File Upload Section */}
//         {fileUploads.map((upload) => (
//           <div key={upload.id} className="mb-6">
//             <label className="block font-semibold mb-2">Upload File {upload.id}</label>
//             <input
//               type="file"
//               accept="*/*"
//               onChange={(e) => handleFileChange(upload.id, e)}
//               className="border border-gray-300 rounded p-2"
//             />
//             <button
//               type="button"
//               onClick={() => handleRemoveFile(upload.id)}
//               className="ml-2 bg-red-500 text-white rounded px-2"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={handleAddFile}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-6"
//         >
//           Add More Files
//         </button>

//         {/* Submit and Cancel */}
//         <div className="flex justify-between">
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="bg-green-500 text-white rounded px-4 py-2"
//           >
//             {loading ? 'Uploading...' : 'Submit'}
//           </button>
//           <button
//             onClick={() => navigate('/')}
//             className="bg-gray-500 text-white rounded px-4 py-2"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;
