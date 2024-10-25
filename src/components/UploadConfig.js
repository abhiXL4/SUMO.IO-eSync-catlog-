import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConfigCatalogUpload.css';

const ConfigCatalogUpload = () => {
  const [selectedECU, setSelectedECU] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vehicleVariant, setVehicleVariant] = useState('');
  const [useExistingSequence, setUseExistingSequence] = useState(false);
  const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
  const [sequenceFiles, setSequenceFiles] = useState([]);
  const [parameterFiles, setParameterFiles] = useState([]);
  const [ecuOptions, setEcuOptions] = useState([]); // State to store ECU options

  const navigate = useNavigate();

  // Fetch ECU names on component mount
  useEffect(() => {
    const fetchEcuOptions = async () => {
      try {
        const response = await fetch('/api/ecus'); // Adjust this URL to match your API endpoint
        const data = await response.json();
        setEcuOptions(data.ecus);
      } catch (error) {
        console.error('Error fetching ECU options:', error);
      }
    };

    fetchEcuOptions();
  }, []);

  const handleECUChange = (e) => setSelectedECU(e.target.value);
  const handleVendorNameChange = (e) => setVendorName(e.target.value);
  const handleVariantChange = (e) => setVehicleVariant(e.target.value);
  const toggleExistingSequence = () => setUseExistingSequence(!useExistingSequence);
  const handleVehicleModelChange = (e) => setSelectedVehicleModel(e.target.value);

  const handleSequenceFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSequenceFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleParameterFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setParameterFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleOkClick = () => {
    navigate('/');
  };

  return (
    <div className="config-catalog">
      <h1>Config Catalog Release Frontend</h1>

      {/* Sequence File Upload Section */}
      <div className="section">
        <h2>Sequence File</h2>

        <div className="form-group">
          <label htmlFor="ecu">Select ECU</label>
          <select id="ecu" value={selectedECU} onChange={handleECUChange}>
            <option value="">Select ECU</option>
            {ecuOptions.map((ecu) => (
              <option key={ecu.id} value={ecu.name}>
                {ecu.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="vendorName">Vendor Name</label>
          <input type="text" id="vendorName" value={vendorName} onChange={handleVendorNameChange} />
        </div>

        <div className="form-group">
          <h3>Sequence File</h3>
          <label>
            <input
              type="checkbox"
              checked={useExistingSequence}
              onChange={toggleExistingSequence}
            />{' '}
            Select Existing Sequence
          </label>
          {useExistingSequence && (
            <select>
              <option value="">Select Sequence</option>
              <option value="seq1">Sequence 1</option>
              <option value="seq2">Sequence 2</option>
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="sequenceFiles">Upload Sequence Files</label>
          <input
            type="file"
            id="sequenceFiles"
            multiple
            onChange={handleSequenceFileChange}
          />
        </div>

        <div className="uploaded-files">
          <h4>Selected Sequence Files:</h4>
          <ul>
            {sequenceFiles.length > 0 ? (
              sequenceFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))
            ) : (
              <p>No files selected</p>
            )}
          </ul>
        </div>

        <button className="btn next-btn">Next</button>
      </div>

      {/* Parameter File Upload Section */}
      <div className="section">
        <h2>Parameter File</h2>

        <div className="form-group">
          <label>Vehicle Model</label>
          <div className="vehicle-models">
            <input
              type="radio"
              id="harrier"
              name="vehicleModel"
              value="Harrier"
              checked={selectedVehicleModel === 'Harrier'}
              onChange={handleVehicleModelChange}
            />
            <label htmlFor="harrier">Harrier</label>

            <input
              type="radio"
              id="safari"
              name="vehicleModel"
              value="Safari"
              checked={selectedVehicleModel === 'Safari'}
              onChange={handleVehicleModelChange}
            />
            <label htmlFor="safari">Safari</label>

            <input
              type="radio"
              id="curvv"
              name="vehicleModel"
              value="Curvv"
              checked={selectedVehicleModel === 'Curvv'}
              onChange={handleVehicleModelChange}
            />
            <label htmlFor="curvv">Curvv</label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="vehicleVariant">Vehicle Variant</label>
          <input
            type="text"
            id="vehicleVariant"
            value={vehicleVariant}
            onChange={handleVariantChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="parameterFiles">Upload Parameter Files</label>
          <input
            type="file"
            id="parameterFiles"
            multiple
            onChange={handleParameterFileChange}
          />
        </div>

        <div className="uploaded-files">
          <h4>Selected Parameter Files:</h4>
          <ul>
            {parameterFiles.length > 0 ? (
              parameterFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))
            ) : (
              <p>No files selected</p>
            )}
          </ul>
        </div>

        <button className="btn confirm-btn" onClick={handleOkClick}>
          Confirm
        </button>
      </div>

      <button className="btn ok-btn" onClick={handleOkClick}>
        OK
      </button>
    </div>
  );
};

export default ConfigCatalogUpload;
