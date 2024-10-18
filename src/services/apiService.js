import axios from 'axios';

// Base URL for your API (now pointing to http://localhost:8000/api/upload)
const BASE_URL = 'http://localhost:8080';

// Fetch all software catalog data
export const getCatalogData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/upload/sort`);
    return response.data;
  } catch (error) {
    console.error('Error fetching catalog data:', error);
    throw error; // Consider throwing a more user-friendly error here
  }
};

// Modify a software entry
export const modifyData = async (dataId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${dataId}`, updatedData); // Ensure your backend has this endpoint
    return response.data;
  } catch (error) {
    console.error('Error modifying data:', error);
    throw error; // Consider throwing a more user-friendly error here
  }
};

// Upload software (multipart form data)
export const uploadSoftware = async (formData) => {
  try {
    const response = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading software:', error);
    throw error; // Consider throwing a more user-friendly error here
  }
};
