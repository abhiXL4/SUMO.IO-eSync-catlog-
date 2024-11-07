// import React, { useState, useEffect } from 'react';
// import { FiDownload, FiEye, FiChevronDown, FiChevronRight, FiHome, FiCheckCircle } from 'react-icons/fi'; 
// import { useNavigate } from 'react-router-dom';
// import { getCatalogListByCatalogueId, filterCatalog, sortCatalog, downloadFile } from '../services/apiService';

// const SWCatalog = () => {
//   const [data, setData] = useState([]);
//   const [catalogFilter, setCatalogFilter] = useState('SW CATALOG');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('uploadDateTime'); 
//   const [ascending, setAscending] = useState(true); 
//   const [expandedECUs, setExpandedECUs] = useState({});
//   const navigate = useNavigate(); 

//   useEffect(() => {
//     // const fetchData = async () => {
//     //   try {
//     //     const response = await getCatalogListByCatalogueId(getCatalogEndpoint(catalogFilter));
//     //     setData(response);
//     //   } catch (error) {
//     //     console.error('Error fetching catalog data:', error);
//     //   }
//     // };
//     // fetchData();
//   }, []);

//   const getCatalogEndpoint = (filter) => {
//     switch (filter) {
//       case 'SW CATALOG': 
//         return 'sw-catalog';  // Adjusted to match backend expectations
//       case 'CONFIG CATALOG': 
//         return 'config-catalog';
//       default: 
//         return 'sw-catalog';  // Fallback to 'sw-catalog'
//     }
//   };
  

//   const applyFilterAndSort = async () => {
//     try {
//       const filteredData = await filterCatalog(getCatalogEndpoint(catalogFilter), { ecuName: searchTerm });
//       setData(filteredData);
//     } catch (error) {
//       console.error('Error applying filter:', error);
//     }
//   };

//   const handleUpload = () => {
//     if (catalogFilter === 'CONFIG CATALOG') {
//       navigate('/config-upload');
//     } else {
//       navigate('/upload');
//     }
//   };

//   const applySorting = async () => {
//     try {
//       const sortedData = await sortCatalog(getCatalogEndpoint(catalogFilter), sortBy, ascending);
//       setData(sortedData);
//     } catch (error) {
//       console.error('Error applying sort:', error);
//     }
//   };

//   const handleDownload = async (id, fileType) => {
//     try {
//       await downloadFile(getCatalogEndpoint(catalogFilter), id, fileType);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//   };

//   const handleView = (ecuName, containerId) => {
//     navigate(`/view`, { state: { ecuName, containerId } });
//   };

//   const toggleExpand = (ecuName) => {
//     setExpandedECUs((prevState) => ({
//       ...prevState,
//       [ecuName]: !prevState[ecuName],
//     }));
//   };

//   // Group the data by ECU name
//   const groupedData = data.reduce((acc, item) => {
//     if (!acc[item.ecuName]) {
//       acc[item.ecuName] = [];
//     }
//     acc[item.ecuName].push(item);
//     return acc;
//   }, {});

//   // Determine the column names based on the selected catalog
//   const catalogTypeName = catalogFilter === 'SW CATALOG' ? 'SW Type' : 'Config Type';
//   const containerIdName = catalogFilter === 'SW CATALOG' ? 'Container ID' : 'Config ID';

//   return (
//     <div className="bg-white shadow rounded-lg w-full">
//       <div className="p-4 flex items-center space-x-2 bg-gray-100 border-b">
//         <FiHome className="text-gray-500" />
//         <span className="text-gray-500">/</span>
//         <span className="font-semibold">{catalogFilter}</span>
//       </div>

//       <div className="p-4 flex justify-between items-center border-b bg-gray-100">
//         <div className="flex space-x-2 items-center">
//           <select value={catalogFilter} onChange={(e) => setCatalogFilter(e.target.value)} className="border p-2 rounded">
//             <option>SW CATALOG</option>
//             <option>CONFIG CATALOG</option> {/* Removed RD CATALOG */}
//           </select>

//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2 rounded">
//             <option>All</option>
//             <option>ACTIVE</option>
//             <option>RETIRED</option>
//           </select>

//           <input
//             type="text"
//             placeholder="Search by ECU Name or Container ID"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border p-2 rounded"
//           />
//           <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={applyFilterAndSort}>Go</button>

//           <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
//             <option value="uploadDateTime">Upload Date</option>
//             <option value="ecuName">ECU Name</option>
//           </select>
//           <button
//             className="bg-gray-500 text-white px-4 py-2 rounded"
//             onClick={() => {
//               setAscending(!ascending); 
//               applySorting(); 
//             }}
//           >
//             {ascending ? 'Asc' : 'Desc'}
//           </button>
//         </div>

//         <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpload}>
//           Upload SW
//         </button>

//       </div>

//       <div className="overflow-x-auto h-500">
//         <table className="min-w-full table-auto border-collapse">
//           <thead className="bg-gray-200 sticky top-0">
//             <tr>
//               <th className="p-2 text-left">ECU Name</th>
//               <th className="p-2 text-center">{catalogTypeName}</th>
//               <th className="p-2 text-center">Release Version</th>
//               <th className="p-2 text-center">{containerIdName}</th>
//               <th className="p-2 text-center">Uploaded By</th>
//               <th className="p-2 text-center">Date Uploaded</th>
//               <th className="p-2 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.keys(groupedData).length === 0 ? (
//               <tr>
//                 <td className="p-4 text-center" colSpan="7">No data available.</td>
//               </tr>
//             ) : (
//               Object.keys(groupedData).map((ecuName) => (
//                 <React.Fragment key={ecuName}>
//                   {/* First row with summary only */}
//                   <tr className="border-t">
//                     <td className="p-2" onClick={() => toggleExpand(ecuName)}>
//                       <div className="flex items-center cursor-pointer">
//                         {expandedECUs[ecuName] ? <FiChevronDown /> : <FiChevronRight />}
//                         <span className="ml-2 font-semibold">{ecuName}</span>
//                       </div>
//                     </td>
//                     <td className="p-2 text-center">N/A</td>
//                     <td className="p-2 text-center">N/A</td>
//                     <td className="p-2 text-center">{groupedData[ecuName][0].catalogueId || 'N/A'}</td>
//                     <td className="p-2 text-center">{groupedData[ecuName][0].updatedBy || 'N/A'}</td>
//                     <td className="p-2 text-center">{groupedData[ecuName][0].updatedAt || 'N/A'}</td>
//                     <td className="p-2 text-center flex justify-center space-x-1">
//                       <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => handleView(ecuName, groupedData[ecuName][0].catalogueId)}>
//                         <FiEye title="View" />
//                       </button>
                      
//                       <FiCheckCircle className="text-gray-600 hover:text-gray-800"title="Check List" />
                      
//                       <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => handleDownload(groupedData[ecuName][0].catalogueId, 'sw')}>
//                         <FiDownload title="Download" />
//                       </button>
//                     </td>
//                   </tr>

//                   {/* Expanded rows for detailed data */}
//                   {expandedECUs[ecuName] && groupedData[ecuName].map((item) => (
//                     <tr key={item.id} className="border-t bg-gray-200">
//                       <td className="p-2 pl-8">{item.ecuName}</td>
//                       <td className="p-2 text-center">{item.swType || item.configType || 'N/A'}</td>
//                       <td className="p-2 text-center">{groupedData[ecuName][0].vendorName || 'N/A'}</td>
//                       <td className="p-2 text-center">{groupedData[ecuName][0].catalogueId || 'N/A'}</td>
//                       <td className="p-2 text-center">{groupedData[ecuName][0].updatedBy || 'N/A'}  </td>
//                       <td className="p-2 text-center">{groupedData[ecuName][0].updatedAt || 'N/A'}</td>
//                       <td className="p-2 text-center flex justify-center space-x-1"></td>
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SWCatalog;






import React, { useState, useEffect } from 'react';
import { FiDownload, FiEye, FiChevronDown, FiChevronRight, FiHome, FiCheckCircle } from 'react-icons/fi'; 
import { useNavigate } from 'react-router-dom';
import { getEcuItems, downloadFile } from '../services/apiService';

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
        const ecuItems = await getEcuItems(); // Fetch ECU items
        setData(ecuItems);
      } catch (error) {
        console.error('Error fetching ECU items:', error);
      }
    };
    fetchData();
  }, []);

  const getCatalogEndpoint = (filter) => {
    switch (filter) {
      case 'SW CATALOG': 
        return 'sw-catalog';  
      case 'CONFIG CATALOG': 
        return 'config-catalog';
      default: 
        return 'sw-catalog'; 
    }
  };

  const applyFilterAndSort = async () => {
    try {
      const filteredData = data.filter(item => item.ecuName.includes(searchTerm)); // Filter locally based on ecuName
      setData(filteredData);
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  };

  const handleUpload = () => {
    if (catalogFilter === 'CONFIG CATALOG') {
      navigate('/config-upload');
    } else {
      navigate('/upload');
    }
  };

  const applySorting = () => {
    const sortedData = [...data].sort((a, b) => {
      if (ascending) {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
    setData(sortedData);
  };

  const handleDownload = async (id) => {
    try {
      await downloadFile(getCatalogEndpoint(catalogFilter), id, 'sw');
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

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.ecuName]) {
      acc[item.ecuName] = [];
    }
    acc[item.ecuName].push(item);
    return acc;
  }, {});

  const catalogTypeName = catalogFilter === 'SW CATALOG' ? 'SW Type' : 'Config Type';
  const containerIdName = catalogFilter === 'SW CATALOG' ? 'Container ID' : 'Config ID';

  return (
    <div className="bg-white shadow rounded-lg w-full h-screen flex flex-col">
      <div className="p-4 flex items-center space-x-2 bg-gray-100 border-b">
        <FiHome className="text-gray-500" />
        <span className="text-gray-500">/</span>
        <span className="font-semibold">{catalogFilter}</span>
      </div>

      <div className="p-4 flex justify-between items-center border-b bg-gray-100">
        <div className="flex space-x-2 items-center">
          <select value={catalogFilter} onChange={(e) => setCatalogFilter(e.target.value)} className="border p-2 rounded">
            <option>SW CATALOG</option>
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

        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpload}>
          Upload SW
        </button>

      </div>

      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-300 sticky top-0">
            <tr>
              <th className="p-2 text-left">ECU Name</th>
              <th className="p-2 text-center">{catalogTypeName}</th>
              <th className="p-2 text-center">Release Version</th>
              <th className="p-2 text-center">{containerIdName}</th>
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
                    <td className="p-2 text-center">{groupedData[ecuName][0].catalogueId || 'N/A'}</td>
                    <td className="p-2 text-center">{groupedData[ecuName][0].updatedBy || 'N/A'}</td>
                    <td className="p-2 text-center">{groupedData[ecuName][0].uploadedDate || 'N/A'}</td>
                    <td className="p-2 text-center flex justify-center space-x-1">
                      <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => handleView(ecuName, groupedData[ecuName][0].catalogueId)}>
                        <FiEye title="View" />
                      </button>
                      <FiCheckCircle className="text-gray-600 hover:text-gray-800" title="Check List" />
                      <button className="text-gray-600 hover:text-gray-800 p-1" onClick={() => handleDownload(groupedData[ecuName][0].catalogueId, 'sw')}>
                        <FiDownload title="Download" />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded rows for detailed data */}
                  {expandedECUs[ecuName] && groupedData[ecuName].map((item) => (
                    <tr key={item.catalogueId} className="border-t bg-gray-200">
                      <td className="p-2 pl-8">{item.ecuName}</td>
                      <td className="p-2 text-center">{item.swType || item.configType || 'N/A'}</td>
                      <td className="p-2 text-center">{item.vendorName || 'N/A'}</td>
                      <td className="p-2 text-center">{item.catalogueId || 'N/A'}</td>
                      <td className="p-2 text-center">{item.updatedBy || 'N/A'}</td>
                      <td className="p-2 text-center">{item.uploadedDate || 'N/A'}</td>
                      <td className="p-2 text-center flex justify-center space-x-1"></td>
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
