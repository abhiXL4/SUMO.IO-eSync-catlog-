import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const UploadPage = () => {
  const [fileUploads, setFileUploads] = useState([{ id: 1 }]); // Start with one file upload section
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleAddFile = () => {
    const newFileUpload = { id: fileUploads.length + 1 };
    setFileUploads([...fileUploads, newFileUpload]);
  };

  const handleRemoveFile = (id) => {
    const updatedFiles = fileUploads.filter(file => file.id !== id);
    setFileUploads(updatedFiles);
  };

  const handleCancel = () => {
    navigate('/'); // Redirect to Home Catalog List page
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">SW Catlog</h1>

      <div className="border rounded-lg p-8 bg-white shadow-md">
        {/* SW File Upload Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">Select ECU</label>
            <select className="w-full border border-gray-300 rounded p-2">
              <option value="">Select ECU</option>
              <option value="ECU1">ECU1</option>
              <option value="ECU2">ECU2</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Select Config ID</label>
            <select className="w-full border border-gray-300 rounded p-2">
              <option value="">Select Config ID</option>
              <option value="Config1">Config1</option>
              <option value="Config2">Config2</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Vendor Name</label>
          <select className="w-full border border-gray-300 rounded p-2">
            <option value="">Select Vendor</option>
            <option value="Bosch">Bosch</option>
            <option value="Aptive">Aptive</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Vehicle Model</label>
          <div>
            <input type="radio" id="harrier" name="vehicleModel" value="Harrier" />
            <label htmlFor="harrier" className="ml-2 mr-4">Harrier</label>

            <input type="radio" id="safari" name="vehicleModel" value="Safari" />
            <label htmlFor="safari" className="ml-2 mr-4">Safari</label>

            <input type="radio" id="curvv" name="vehicleModel" value="Curvv" />
            <label htmlFor="curvv" className="ml-2">Curvv</label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Vehicle Variant</label>
          <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., A1/XZ/AMA/Sport" />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">SW Release Version</label>
          <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., 1.0"/> 
        </div>


        <div className="mb-6">
          <label className="block font-semibold mb-2">HW PartNumber</label>
          <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., HW_123456" />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Communication Protocol</label>
          <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="e.g., UDS/ETH" />
        </div>

        {/* Security Access Section */}
        <h2 className="text-xl font-semibold mb-4">Security Access</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-2">Security Method</label>
            <input type="text" className="w-full border border-gray-300 rounded p-2" />
          </div>

          <div>
            <label className="block font-semibold mb-2">Security Level</label>
            <input type="text" className="w-full border border-gray-300 rounded p-2" />
          </div>

          <div>
            <label className="block font-semibold mb-2">FW Signature</label>
            <input type="text" className="w-full border border-gray-300 rounded p-2" />
          </div>
        </div>

        {/* File Upload Section */}
        <h2 className="text-xl font-semibold mt-8 mb-4">File Upload</h2>

        {fileUploads.map((file, index) => (
          <div key={file.id} className="mb-4 border border-gray-300 rounded p-4">
            <h3 className="font-semibold mb-2">File {index + 1}</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-2">Partition</label>
                <select className="w-full border border-gray-300 rounded p-2">
                  <option value="">Select Partition</option>
                  {/* Add your partition options here */}
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
                <input type="file" className="w-full" />
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
                <label className="font-semibold">Is Encrypted</label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="font-semibold">Is Compressed</label>
              </div>
            </div>

            {/* Cancel Button to remove file section */}
            {index > 0 && (
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleRemoveFile(file.id)}
              >
                Cancel
              </button>
            )}
          </div>
        ))}

        {/* Button to add another file section */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddFile}
        >
          + Add Another File
        </button>

        {/* Submit and Cancel buttons */}
        <div className="mt-8 flex space-x-4">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            Upload SW
          </button>
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
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
