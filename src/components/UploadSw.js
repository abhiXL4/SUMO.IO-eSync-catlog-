import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadSoftware } from '../services/apiService';  // Ensure this is correctly imported

const UploadSw = () => {
  const [formData, setFormData] = useState({
    file: null, // Store the selected file
  });
  const [dragActive, setDragActive] = useState(false); // State to handle drag over visual feedback
  const navigate = useNavigate();

  // Handle file change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0], // Set the selected file
    });
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true); // Set visual feedback
  };

  // Handle drag leave
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false); // Remove visual feedback
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false); // Remove visual feedback
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      console.log('File dropped:', droppedFiles[0]); // Logging to ensure file is detected
      setFormData({
        ...formData,
        file: droppedFiles[0], // Assign the dropped file to state
      });
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    const form = new FormData();
    if (formData.file) form.append('file', formData.file); // Append the file to the form data

    try {
      await uploadSoftware(form);
      alert('Software uploaded successfully');
      navigate('/');
    } catch (error) {
      console.error('Error uploading software:', error);
      alert('Failed to upload software');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">SW Upload</h1>
      <div
        className={`border-2 border-dashed ${dragActive ? 'border-blue-500' : 'border-gray-400'} 
                    rounded-lg p-16 text-center bg-white shadow-xl w-full max-w-3xl h-[50vh] overflow-auto`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-lg mb-4">Drag and drop a file here or click below to choose a file</p>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="mt-4"
        />
        {/* Debugging - display the file name */}
        {formData.file && <p className="mt-4 text-sm text-gray-600">Selected File: {formData.file.name}</p>}
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          onClick={handleUpload}
        >
          Upload SW
        </button>
        <button
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          onClick={() => navigate('/')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UploadSw;
