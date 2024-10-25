import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCatalogList } from '../services/apiService'; // Adjust the path based on your structure
import axios from 'axios'; // Import axios for making requests

const UploadPage = () => {
  const [fileUploads, setFileUploads] = useState([{ id: 1, file: null }]);
  const [configCatalog, setConfigCatalog] = useState([]);
  const [selectedECU, setSelectedECU] = useState('');
  const [selectedConfigId, setSelectedConfigId] = useState('');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Config Catalog
    const fetchConfigCatalog = async () => {
      try {
        const data = await getCatalogList('config-catalog');
        setConfigCatalog(data);
      } catch (error) {
        console.error('Error fetching Config Catalog:', error);
      }
    };

    fetchConfigCatalog();
  }, []);

  const handleAddFile = () => {
    const newFileUpload = { id: fileUploads.length + 1, file: null };
    setFileUploads([...fileUploads, newFileUpload]);
  };

  const handleRemoveFile = (id) => {
    const updatedFiles = fileUploads.filter((file) => file.id !== id);
    setFileUploads(updatedFiles);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleECUChange = (event) => {
    setSelectedECU(event.target.value);
  };

  const handleConfigIdChange = (event) => {
    setSelectedConfigId(event.target.value);
  };

  // Handle file selection
  const handleFileChange = (index, event) => {
    const selectedFile = event.target.files[0];
    const updatedFileUploads = fileUploads.map((fileUpload) =>
      fileUpload.id === index ? { ...fileUpload, file: selectedFile } : fileUpload
    );
    setFileUploads(updatedFileUploads);
  };

  // Request presigned URL from backend and upload file to S3
  const uploadFile = async (file) => {
    try {
      // Step 1: Request presigned URL from backend
      const response = await axios.get('/generate-presigned-url', {
        params: { fileName: file.name, contentType: file.type },
      });
      const presignedUrl = response.data.url;

      // Step 2: Upload file to S3 using the presigned URL
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      console.log(`File ${file.name} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async () => {
    for (const fileUpload of fileUploads) {
      if (fileUpload.file) {
        await uploadFile(fileUpload.file); // Upload each selected file
      }
    }
    console.log('All files uploaded');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">SW Catalog</h1>

      <div className="border rounded-lg p-8 bg-white shadow-md">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">Select ECU</label>
            <select
              className="w-full border border-gray-300 rounded p-2"
              value={selectedECU}
              onChange={handleECUChange}
            >
              <option value="">Select ECU</option>
              {configCatalog.map((item) => (
                <option key={item.ecuName} value={item.ecuName}>
                  {item.ecuName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Select Config ID</label>
            <select
              className="w-full border border-gray-300 rounded p-2"
              value={selectedConfigId}
              onChange={handleConfigIdChange}
            >
              <option value="">Select Config ID</option>
              {configCatalog
                .filter((item) => item.ecuName === selectedECU)
                .map((item) => (
                  <option key={item.configId} value={item.configId}>
                    {item.configId}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Vendor Name</label>
          <select className="w-full border border-gray-300 rounded p-2">
            <option value="">Select Vendor</option>
            <option value="vendor1">Vendor 1</option>
            <option value="vendor2">Vendor 2</option>
            <option value="vendor3">Vendor 3</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Vehicle Model</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="harrier"
              name="vehicleModel"
              value="Harrier"
              className="mr-2"
              onChange={(e) => setSelectedVehicleModel(e.target.value)}
            />
            <label htmlFor="harrier" className="mr-4">Harrier</label>

            <input
              type="radio"
              id="safari"
              name="vehicleModel"
              value="Safari"
              className="mr-2"
              onChange={(e) => setSelectedVehicleModel(e.target.value)}
            />
            <label htmlFor="safari" className="mr-4">Safari</label>

            <input
              type="radio"
              id="curvv"
              name="vehicleModel"
              value="Curvv"
              className="mr-2"
              onChange={(e) => setSelectedVehicleModel(e.target.value)}
            />
            <label htmlFor="curvv" className="mr-4">Curvv</label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Vehicle Variant</label>
          <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., A1/XZ/AMA/Sport" />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">SW Release Version</label>
          <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., 1.0" />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">HW Part Number</label>
          <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., HW_123456" />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Communication Protocol</label>
          <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., UDS/ETH" />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Security Access</label>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Security Method</label>
              <input type="text" className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Security Level</label>
              <input type="text" className="w-full border border-gray-300 rounded p-2" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">FW Signature</label>
          <input type="text" className="w-full border border-gray-300 rounded p-2" />
        </div>

        {/* File Upload Section */}
        <h2 className="text-xl font-semibold mt-8 mb-4">File Upload</h2>
        {fileUploads.map((file, index) => (
          <div key={file.id} className="relative mb-4 border border-gray-300 rounded p-4">
            <h3 className="font-semibold mb-2">File {index + 1}</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-2">Partition</label>
                <select className="w-full border border-gray-300 rounded p-2">
                  <option value="">Select Partition</option>
                  <option value="P1">Partition 1</option>
                  <option value="P2">Partition 2</option>
                  <option value="P3">Partition 3</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">File Format</label>
                <select className="w-full border border-gray-300 rounded p-2">
                  <option value="">Select Format</option>
                  <option value="intel-hex">Intel Hex</option>
                  <option value="motorola">Motorola</option>
                  <option value="binary">Binary</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Start Address</label>
                <input type="text" className="w-full border border-gray-300 rounded p-2" />
              </div>

              <div>
                <label className="block font-semibold mb-2">Binary File Upload</label>
                <input type="file" className="w-full" onChange={(e) => handleFileChange(file.id, e)} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block font-semibold mb-2">Compressed Size</label>
                <input type="text" className="w-full border border-gray-300 rounded p-2" />
              </div>

              <div>
                <label className="block font-semibold mb-2">Uncompressed Size</label>
                <input type="text" className="w-full border border-gray-300 rounded p-2" />
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>Is Encrypted</label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>Is Compressed</label>
              </div>
            </div>

            {/* Plus Button */}
            <div className="absolute right-4 bottom-4">
              <button
                className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-blue-600"
                onClick={handleAddFile}
              >
                +
              </button>
            </div>

            {fileUploads.length > 1 && (
              <div className="absolute right-12 bottom-4">
                <button
                  className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600"
                  onClick={() => handleRemoveFile(file.id)}
                >
                  -
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="mt-8">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded mr-4 hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;



// import React, { useState } from 'react';

// const UploadPage = () => {
//   const [file, setFile] = useState(null);

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

//     // The presigned URL provided for the upload
//     const presignedUrl = 'https://catalogue-manager-test.s3.amazonaws.com/Automotive-SPICE.pdf?AWSAccessKeyId=AKIAYSGP3F75JOYOPKA7&Signature=Fb%2FLib5qbNcN0PBy8m%2Br3M8P9VU%3D&Expires=1729842416';

//     try {
//       // Perform the PUT request to the presigned URL
//       const response = await fetch(presignedUrl, {
//         method: 'PUT',
//         body: file,
//         headers: {
//           'Content-Type': 'application/pdf', // Hardcode to match presigned URL if needed
//         },
        
//       });

//       if (response.ok) {
//         console.log('File uploaded successfully');
//       } else {
//         const errorText = await response.text();
//         console.error('Failed to upload file to S3:', response.status, errorText);
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} /> {/* File input to select the file */}
//       <button onClick={uploadFileToS3}>Upload File</button> {/* Button to trigger the upload */}
//     </div>
//   );
// };

// export default UploadPage;

