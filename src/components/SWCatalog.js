import React, { useState, useEffect } from 'react';
import { FiDownload, FiEye, FiChevronDown, FiChevronRight, FiHome, FiEdit, FiCheckCircle } from 'react-icons/fi'; // Import icons
import { useNavigate } from 'react-router-dom';
import { getCatalogList, filterCatalog, sortCatalog, retireCatalog, downloadFile } from '../services/apiService';

const SWCatalog = () => {
  const [data, setData] = useState([]);
  const [catalogFilter, setCatalogFilter] = useState('SW CATALOG');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uploadDateTime'); // Default sort option
  const [ascending, setAscending] = useState(true); // Default to ascending order
  const [expandedECUs, setExpandedECUs] = useState({});
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCatalogList(getCatalogEndpoint(catalogFilter));
        setData(response);
      } catch (error) {
        console.error('Error fetching catalog data:', error);
      }
    };
    fetchData();
  }, [catalogFilter]);

  const getCatalogEndpoint = (filter) => {
    switch (filter) {
      case 'SW CATALOG': return 'sw-catalog';
      case 'RD CATALOG': return 'rd-catalog';
      case 'CONFIG CATALOG': return 'config-catalog';
      default: return 'sw-catalog';
    }
  };

  // Apply filters and sorting to the catalog data
  const applyFilterAndSort = async () => {
    try {
      const filteredData = await filterCatalog(getCatalogEndpoint(catalogFilter), { ecuName: searchTerm });
      setData(filteredData);
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  };

  // Apply sorting to the catalog data
  const applySorting = async () => {
    try {
      const sortedData = await sortCatalog(getCatalogEndpoint(catalogFilter), sortBy, ascending);
      setData(sortedData);
    } catch (error) {
      console.error('Error applying sort:', error);
    }
  };

  // Handle retiring a catalog entry
  const handleRetire = async (id) => {
    try {
      await retireCatalog(getCatalogEndpoint(catalogFilter), id);
      const updatedData = await getCatalogList(getCatalogEndpoint(catalogFilter));
      setData(updatedData);
    } catch (error) {
      console.error('Error retiring catalog entry:', error);
    }
  };

  // Handle file download
  const handleDownload = async (id, fileType) => {
    try {
      await downloadFile(getCatalogEndpoint(catalogFilter), id, fileType);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // New logic to handle the view button click
  const handleView = (ecuName) => {
    // Navigate to detailed ECU view page, passing the ECU name in the URL
    navigate(`/${ecuName}`);
  };

  const toggleExpand = (ecuName) => {
    setExpandedECUs((prevState) => ({
      ...prevState,
      [ecuName]: !prevState[ecuName],
    }));
  };

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.ecuName]) {
      acc[item.ecuName] = [];
    }
    acc[item.ecuName].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-white shadow rounded-lg w-full">
      <div className="p-4 flex items-center space-x-2 bg-gray-100 border-b">
        <FiHome className="text-gray-500" />
        <span className="text-gray-500">/</span>
        <span className="font-semibold">{catalogFilter}</span>
      </div>

      <div className="p-4 flex justify-between items-center border-b bg-gray-100">
        <div className="flex space-x-2 items-center">
          <select value={catalogFilter} onChange={(e) => setCatalogFilter(e.target.value)} className="border p-2 rounded">
            <option>SW CATALOG</option>
            <option>RD CATALOG</option>
            <option>CONFIG CATALOG</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2 rounded">
            <option>All</option>
            <option>ACTIVE</option>
            <option>RETIRED</option>
          </select>
    
          <input
            type="text"
            placeholder="Search by ECU Name or Container ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={applyFilterAndSort}>Go</button>

          {/* Sorting controls */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
            <option value="uploadDateTime">Upload Date</option>
            <option value="ecuName">ECU Name</option>
          </select>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setAscending(!ascending); // Toggle sorting order
              applySorting(); // Apply the sorting
            }}
          >
            {ascending ? 'Asc' : 'Desc'}
          </button>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigate('/upload')}>
          Upload SW
        </button>
      </div>

      {/* Catalog Table */}
      <div className="overflow-x-auto h-96">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="p-2 text-left">ECU Name</th>
              <th className="p-2 text-left">Container ID</th>
              <th className="p-2 text-left">Uploaded By</th>
              <th className="p-2 text-left">Date Uploaded</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan="5">No data available.</td>
              </tr>
            ) : (
              Object.keys(groupedData).map((ecuName) => (
                <React.Fragment key={ecuName}>
                  <tr className="border-t">
                    <td className="p-2" onClick={() => toggleExpand(ecuName)}>
                      <div className="flex items-center cursor-pointer">
                        {expandedECUs[ecuName] ? <FiChevronDown /> : <FiChevronRight />}
                        <span className="ml-2 font-semibold">{ecuName}</span>
                      </div>
                    </td>
                    <td className="p-2">{groupedData[ecuName][0].containerId}</td>
                    <td className="p-2">{groupedData[ecuName][0].uploadedBy || 'Unknown'}</td>
                    <td className="p-2">{groupedData[ecuName][0].uploadDateTime || 'N/A'}</td>
                    <td className="p-2 text-center flex space-x-2">
                      <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => navigate(`/modify/${groupedData[ecuName][0].id}`)}>
                        <FiEdit title="Modify" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => handleRetire(groupedData[ecuName][0].id)}>
                        Retire
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => handleDownload(groupedData[ecuName][0].id, 'TestReport')}>
                        <FiDownload title="Download" />
                      </button>
                      {/* Add the View button logic here */}
                      <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => handleView(ecuName)}>
                        <FiEye title="View" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => {/* Add status check logic here */}}>
                        <FiCheckCircle title="Status Check" />
                      </button>
                    </td>
                  </tr>

                  {expandedECUs[ecuName] && (
                    <tr>
                      <td colSpan="5" className="p-2 bg-gray-100">
                        <div className="max-h-48 overflow-y-auto">
                          <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2 text-left">ECU Name</th>
                                <th className="p-2 text-left">SW Type</th>
                                <th className="p-2 text-left">Version</th>
                                <th className="p-2 text-left">Container ID</th>
                                <th className="p-2 text-left">Uploaded By</th>
                                <th className="p-2 text-left">Date Uploaded</th>
                                <th className="p-2 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {groupedData[ecuName].map((item) => (
                                <tr key={item.id} className="border-t">
                                  <td className="p-2">{item.ecuName}</td>
                                  <td className="p-2">{item.swType}</td>
                                  <td className="p-2">{item.version}</td>
                                  <td className="p-2">{item.containerId}</td>
                                  <td className="p-2">{item.uploadedBy || 'Unknown'}</td>
                                  <td className="p-2">{item.uploadDateTime || 'N/A'}</td>
                                  <td className="p-2 text-center flex space-x-2">
                                    <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => {/* Add view logic here */}}>
                                      <FiEye title="View" />
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => {/* Add status check logic here */}}>
                                      <FiCheckCircle title="Status Check" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SWCatalog;
