import axios from 'axios';

// Base URL for your API
const BASE_URL = 'http://localhost:8080';

/**
 * Get catalog list based on catalog type (SW, RD, Config)
 */
export const getCatalogList = async (catalogType) => {
  try {
    const response = await axios.get(`${BASE_URL}/${catalogType}/list`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${catalogType} catalog data:`, error);
    throw error;
  }
};

// /**
//  * Fetch ECU details by ECU name (added this function based on your requirement)
//  */
// export const getECUDetails = async (ecuName) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/ecu/${ecuName}`); // Assuming your API has this endpoint
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching details for ECU: ${ecuName}`, error);
//     throw error;
//   }
// };

/**
 * Fetch ECU details by ECU name (added this function based on your requirement)
 */
export const getCatalogDetails = async (ecuName, containerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/view/${ecuName}/${containerId}`); // Assuming your API has this endpoint
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ECU: ${ecuName}, Container: ${containerId}`, error);
    throw error;
  }
};

/**
 * Filter catalog based on parameters
 */
export const filterCatalog = async (catalogType, filterParams) => {
  try {
    const response = await axios.get(`${BASE_URL}/${catalogType}/filter`, { params: filterParams });
    return response.data;
  } catch (error) {
    console.error(`Error filtering ${catalogType} catalog data:`, error);
    throw error;
  }
};

/**
 * Sort catalog entries
 */
export const sortCatalog = async (catalogType, sortBy, ascending) => {
  try {
    const response = await axios.get(`${BASE_URL}/${catalogType}/sort`, { params: { sortBy, ascending } });
    return response.data;
  } catch (error) {
    console.error(`Error sorting ${catalogType} catalog data:`, error);
    throw error;
  }
};

/**
 * Retire a catalog entry by ID
 */
export const retireCatalog = async (catalogType, id) => {
  try {
    await axios.patch(`${BASE_URL}/${catalogType}/retire/${id}`);
  } catch (error) {
    console.error(`Error retiring ${catalogType} catalog entry:`, error);
    throw error;
  }
};

/**
 * Download a file (Test Report or Release Notes)
 */
export const downloadFile = async (catalogType, id, fileType) => {
  try {
    const response = await axios.post(`${BASE_URL}/${catalogType}/download`, { id, fileType }, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileType}_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(`Error downloading file from ${catalogType}:`, error);
    throw error;
  }
};

/**
 * Update the status of a catalog entry
 */
export const updateStatus = async (catalogType, id, newStatus) => {
  try {
    const response = await axios.put(`${BASE_URL}/${catalogType}/status/${id}`, { status: newStatus });
    return response.data; // Assuming your API returns the updated entry
  } catch (error) {
    console.error(`Error updating status for ${catalogType} catalog entry with ID ${id}:`, error);
    throw error;
  }
};
