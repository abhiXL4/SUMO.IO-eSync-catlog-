import React, { useState, useEffect } from 'react';
import { FiDownload, FiEye, FiChevronDown, FiChevronRight, FiHome, FiCheckCircle } from 'react-icons/fi'; 
import { useNavigate } from 'react-router-dom';
import { getCatalogList, filterCatalog, sortCatalog, downloadFile } from '../services/apiService';

const SWCatalog = () => {
  const [data, setData] = useState([]);
  const [catalogFilter, setCatalogFilter] = useState('SW CATALOG');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uploadDateTime'); 
  const [ascending, setAscending] = useState(true); 
  const [expandedECUs, setExpandedECUs] = useState({});
  const navigate = useNavigate(); 

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

  const applyFilterAndSort = async () => {
    try {
      const filteredData = await filterCatalog(getCatalogEndpoint(catalogFilter), { ecuName: searchTerm });
      setData(filteredData);
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  };

  const applySorting = async () => {
    try {
      const sortedData = await sortCatalog(getCatalogEndpoint(catalogFilter), sortBy, ascending);
      setData(sortedData);
    } catch (error) {
      console.error('Error applying sort:', error);
    }
  };

  // const handleRetire = async (id) => {
  //   try {
  //     await retireCatalog(getCatalogEndpoint(catalogFilter), id);
  //     const updatedData = await getCatalogList(getCatalogEndpoint(catalogFilter));
  //     setData(updatedData);
  //   } catch (error) {
  //     console.error('Error retiring catalog entry:', error);
  //   }
  // };

  const handleDownload = async (id, fileType) => {
    try {
      await downloadFile(getCatalogEndpoint(catalogFilter), id, fileType);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleView = (ecuName, containerId) => {
    navigate(`/view`, { state: { ecuName, containerId } });
  };
  

  const toggleExpand = (ecuName) => {
    setExpandedECUs((prevState) => ({
      ...prevState,
      [ecuName]: !prevState[ecuName],
    }));
  };

  // Group the data by ECU name
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

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
            <option value="uploadDateTime">Upload Date</option>
            <option value="ecuName">ECU Name</option>
          </select>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setAscending(!ascending); 
              applySorting(); 
            }}
          >
            {ascending ? 'Asc' : 'Desc'}
          </button>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigate('/upload')}>
          Upload SW
        </button>
      </div>

      <div className="overflow-x-auto h-500">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="p-2 text-left">ECU Name</th>
              <th className="p-2 text-center">SW Type</th>
              <th className="p-2 text-center">Version</th>
              <th className="p-2 text-center">Container ID</th>
              <th className="p-2 text-center">Uploaded By</th>
              <th className="p-2 text-center">Date Uploaded</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan="7">No data available.</td>
              </tr>
            ) : (
              Object.keys(groupedData).map((ecuName) => (
                <React.Fragment key={ecuName}>
                  {/* First row with summary only */}
                  <tr className="border-t">
                    <td className="p-2" onClick={() => toggleExpand(ecuName)}>
                      <div className="flex items-center cursor-pointer">
                        {expandedECUs[ecuName] ? <FiChevronDown /> : <FiChevronRight />}
                        <span className="ml-2 font-semibold">{ecuName}</span>
                      </div>
                    </td>
                    <td className="p-2 text-center">N/A</td>
                    <td className="p-2 text-center">N/A</td>
                    <td className="p-2 text-center">{groupedData[ecuName][0].containerId || 'N/A'}</td>
                    <td className="p-2 text-center">{groupedData[ecuName][0].uploadedBy || 'Unknown'}</td>
                    <td className="p-2 text-center">{groupedData[ecuName][0].releaseDate || 'N/A'}</td>
                    <td className="p-2 text-center flex justify-center space-x-1">
                      <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => handleView(ecuName, groupedData[ecuName][0].containerId)}>
                        <FiEye title="View" />
                      </button>
                      
                      <FiCheckCircle className="text-gray-600 hover:text-gray-800"title="Check List" />
                      
                      <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => handleDownload(groupedData[ecuName][0].id, 'sw')}>
                        <FiDownload title="Download" />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded rows for detailed data */}
                  {expandedECUs[ecuName] && groupedData[ecuName].map((item) => (
                    <tr key={item.id} className="border-t bg-gray-200">
                      <td className="p-2 pl-10">{item.ecuName}</td>
                      <td className="p-2 text-center">{item.swType || 'N/A'}</td>
                      <td className="p-2 text-center">{item.version || 'N/A'}</td>
                      <td className="p-2 text-center">{item.containerId || 'N/A'}</td>
                      <td className="p-2 text-center">{item.uploadedBy || 'Unknown'}</td>
                      <td className="p-2 text-center">{item.releaseDate || 'N/A'}</td>
                      <td className="p-2 text-center flex justify-center space-x-1">
                        
                      </td>
                    </tr>
                  ))}
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
