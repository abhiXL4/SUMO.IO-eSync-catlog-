import React, { useState, useEffect } from 'react';
import { FiDownload, FiEye, FiCheckCircle, FiAlertCircle, FiHome, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getCatalogData } from '../services/apiService';

const SWCatalog = () => {
  const [data, setData] = useState([]);
  const [catalogFilter, setCatalogFilter] = useState('SW CATALOG');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedECUs, setExpandedECUs] = useState({}); // Track which ECU names are expanded
  const [hoveredECU, setHoveredECU] = useState(null); // Track hovered ECU name
  const navigate = useNavigate();

  // Fetch catalog data from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catalogData = await getCatalogData();
        setData(catalogData);
      } catch (error) {
        console.error('Error fetching catalog data:', error);
      }
    };
    fetchData();
  }, []);

  // Filter data based on catalog, status, and search term
  const filteredData = data.filter(item => {
    const matchesCatalog = catalogFilter === 'SW CATALOG'; // Adjust catalog filtering if necessary
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter; // Example filter
    const matchesSearch = item.ecuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.containerId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCatalog && matchesStatus && matchesSearch;
  });

  // Group filtered data by ECU name
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.ecuName]) {
      acc[item.ecuName] = [];
    }
    acc[item.ecuName].push(item);
    return acc;
  }, {});

  // Toggle the expanded state of an ECU group
  const toggleExpand = (ecuName) => {
    setExpandedECUs(prevState => ({
      ...prevState,
      [ecuName]: !prevState[ecuName],
    }));
  };

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

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2 rounded">
            <option>All</option>
            <option>ECU NAME</option>
            <option>CONTAINER ID</option>
          </select>

          <input
            type="text"
            placeholder="Search by ECU Name or Container ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Go</button>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigate('/upload')}>
          Upload SW
        </button>
      </div>

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
                <td className="p-4 text-center" colSpan="7">No data available.</td>
              </tr>
            ) : (
              Object.keys(groupedData).map((ecuName) => (
                <React.Fragment key={ecuName}>
                  {/* Main row with limited details */}
                  <tr className="border-t">
                    <td
                      className="p-2 whitespace-nowrap"
                      onMouseEnter={() => setHoveredECU(ecuName)}  // Set hovered ECU on mouse enter
                      onMouseLeave={() => setHoveredECU(null)}  // Reset on mouse leave
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleExpand(ecuName)}
                      >
                        {expandedECUs[ecuName] ? <FiChevronDown /> : <FiChevronRight />}
                        <span className="ml-2 font-semibold">{ecuName}</span>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">{groupedData[ecuName][0].containerId}</td>
                    <td className="p-2 whitespace-nowrap">{groupedData[ecuName][0].uploadedBy || 'Unknown'}</td>
                    <td className="p-2 whitespace-nowrap">{groupedData[ecuName][0].uploadDateTime || 'N/A'}</td>
                    <td className="p-2 text-center">
                      <div className="flex justify-center items-center space-x-3">
                        {/* Show Modify button only when NOT hovering over the ECU Name */}
                        {hoveredECU !== ecuName && (
                          <button className="text-gray-600 hover:text-gray-800 p-1 focus:outline-none">
                            <span className="font-semibold">Modify</span>
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-800 p-1 focus:outline-none">
                          <FiDownload className="text-xl" title="Download" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 p-1 focus:outline-none">
                          <FiEye className="text-xl" title="View" />
                        </button>
                        {groupedData[ecuName][0].uploaded ? (
                          <FiCheckCircle className="text-green-500 text-xl" title="Uploaded" />
                        ) : (
                          <FiAlertCircle className="text-red-500 text-xl" title="Error" />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded section showing more details with limited Action icons */}
                  {expandedECUs[ecuName] && (
                    <tr>
                      <td colSpan="5" className="p-2">
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
                              </tr>
                            </thead>
                            <tbody>
                              {groupedData[ecuName].map((row, index) => (
                                <tr className="border-t" key={index}>
                                  <td className="p-2 whitespace-nowrap">{row.ecuName}</td>
                                  <td className="p-2 whitespace-nowrap">{row.swType}</td>
                                  <td className="p-2 whitespace-nowrap">{row.version}</td>
                                  <td className="p-2 whitespace-nowrap">{row.containerId}</td>
                                  <td className="p-2 whitespace-nowrap">{row.uploadedBy || 'Unknown'}</td>
                                  <td className="p-2 whitespace-nowrap">{row.uploadDateTime || 'N/A'}</td>
                                  <td className="p-2 text-center">
                                    <div className="flex justify-center items-center space-x-2">
                                      <button className="text-gray-600 hover:text-gray-800 p-1 focus:outline-none">
                                        <span className="font-semibold">Modify</span>
                                      </button>
                                      <button className="text-gray-600 hover:text-gray-800 p-1 focus:outline-none">
                                        <FiDownload className="text-xl" title="Download" />
                                      </button>
                                      <button className="text-gray-600 hover:text-gray-800 p-1 focus:outline-none">
                                        <FiEye className="text-xl" title="View" />
                                      </button>
                                    </div>
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
