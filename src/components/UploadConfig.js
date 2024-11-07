import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const UploadPage = () => {
  const [fileUploads, setFileUploads] = useState([{ id: 1, file: null, md5Hash: null }]);
  const [selectedECU, setSelectedECU] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleVariant, setVehicleVariant] = useState('');
  const [releaseVersion, setReleaseVersion] = useState('');
  const [swVersion, setSwVersion] = useState('');
  const [hwPartNumber, setHwPartNumber] = useState('');
  const [communicationProtocol, setCommunicationProtocol] = useState('');
  const [securityMethod, setSecurityMethod] = useState('');
  const [securityLevel, setSecurityLevel] = useState('');
  const [fwSignature, setFwSignature] = useState('');
  const [catalogType, setCatalogType] = useState('Config_Catalogue');
  const [configId, setConfigId] = useState('');
  const [configOptions, setConfigOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (index, event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
        const md5Hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray)); // Base64 encoded MD5 hash
  
        setFileUploads((prevUploads) =>
          prevUploads.map((upload) =>
            upload.id === index
              ? { ...upload, file: selectedFile, md5Hash, fileType: selectedFile.type, fileSize: selectedFile.size }
              : upload
          )
        );
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };
  

  const handleRemoveFile = (id) => {
    setFileUploads((prevUploads) => prevUploads.filter((upload) => upload.id !== id));
  };

  const handleAddFile = () => {
    setFileUploads((prevUploads) => [...prevUploads, { id: prevUploads.length + 1, file: null, md5Hash: null }]);
  };

  const requestPresignedUrls = async () => {
    try {
      const metadataPayload = [
        {
          catalogueType: catalogType,
          ecuName: selectedECU,
          releaseVersion,
          configVersion: swVersion,
          vendorName,
          vehicleModel,
          vehicleVariant,
          fileMetadata: fileUploads
          .filter((upload) => upload.file) // Only include files that are selected
          .map((upload) => ({
            fileName: upload.file.name,
            fileType: upload.fileType,
            fileSize: upload.fileSize,
            md5: upload.md5Hash, // MD5 hash
            status: 'pending'    // Initial status
          })),

        },
      ];

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const presignedUrls = await requestPresignedUrls();
      const uploadPromises = fileUploads.map(async (upload, index) => {
        const presignedUrl = presignedUrls[index]?.presignedUrl;
        if (upload.file && presignedUrl) {
          try {
            console.log(`Starting upload for ${upload.file.name}`);
            await uploadFileToS3(upload.file, presignedUrl, upload.md5Hash);
            await updateFileStatus(upload.md5Hash, 'uploaded');
          } catch (error) {
            await updateFileStatus(upload.md5Hash, 'failed');
            alert(`Upload failed for ${upload.file.name}: ${error.message}`);
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
  
  const uploadFileToS3 = async (file, presignedUrl, md5Hash) => {
    try {
      const response = await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
          'Content-MD5': md5Hash,
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
  

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700">Config Catalog</h1>
      <div className="border rounded-lg p-8 bg-white shadow-lg">
  
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium mb-2 text-gray-700">Catalog Type</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
              value={catalogType}
              onChange={(e) => setCatalogType(e.target.value)}
            >
              <option value="Config_Catalogue">Config Catalogue</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">Select ECU</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
              value={selectedECU}
              onChange={(e) => setSelectedECU(e.target.value)}
            >
              <option value="" disabled>Select ECU</option>
              <option value="BCM">BCM</option>
              <option value="FATC">FATC</option>
              <option value="CCM">CCM</option>
              <option value="MCU">MCU</option>
              <option value="CCH">CCH</option>
              <option value="DCS">DCS</option>
              <option value="DMS">DMS</option>
              <option value="DSM">DSM</option>
              <option value="EMS">EMS</option>
              <option value="EPAS">EPAS</option>
            </select>
          </div>
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Config ID</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
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
  
        {/* Additional Form Fields */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Vendor Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
            placeholder="BOSCH/APTIVE"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
          />
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Vehicle Model</label>
          <div className="border rounded-lg p-3">
            <label className="block">
              <input
                type="radio"
                value="Harrier"
                checked={vehicleModel === "Harrier"}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="mr-2"
              />
              Harrier
            </label>
            <label className="block">
              <input
                type="radio"
                value="Safari"
                checked={vehicleModel === "Safari"}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="mr-2"
              />
              Safari
            </label>
            <label className="block">
              <input
                type="radio"
                value="Curvv"
                checked={vehicleModel === "Curvv"}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="mr-2"
              />
              Curvv
            </label>
          </div>
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Vehicle Variant</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
            placeholder="A11/XZ+/XMA/SPORT"
            value={vehicleVariant}
            onChange={(e) => setVehicleVariant(e.target.value)}
          />
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">SW Release Version</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
            placeholder="e.g., 1.0"
            value={releaseVersion}
            onChange={(e) => setReleaseVersion(e.target.value)}
          />
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">SW Version</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
            placeholder="e.g., 1.0"
            value={swVersion}
            onChange={(e) => setSwVersion(e.target.value)}
          />
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">HW Part Number</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
            placeholder="e.g., HW_123456"
            value={hwPartNumber}
            onChange={(e) => setHwPartNumber(e.target.value)}
          />
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Communication Protocol</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
            placeholder="UDS/ETH"
            value={communicationProtocol}
            onChange={(e) => setCommunicationProtocol(e.target.value)}
          />
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Security Method</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
            value={securityMethod}
            onChange={(e) => setSecurityMethod(e.target.value)}
          />
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Security Level</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
            value={securityLevel}
            onChange={(e) => setSecurityLevel(e.target.value)}
          />
        </div>
  
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Firmware Signature</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 focus:outline-none transition"
            value={fwSignature}
            onChange={(e) => setFwSignature(e.target.value)}
          />
        </div>
  
        {/* File Upload Section */}
        {fileUploads.map((upload) => (
          <div key={upload.id} className="mb-6">
            <label className="block font-medium mb-2 text-gray-700">Upload File {upload.id}</label>
            <input
              type="file"
              accept="*/*"
              onChange={(e) => handleFileChange(upload.id, e)}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => handleRemoveFile(upload.id)}
              className="ml-2 bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddFile}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 mb-6 hover:bg-blue-600 transition"
        >
          Add More Files
        </button>
  
        {/* Submit and Cancel */}
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Uploading...' : 'Submit'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default UploadPage;