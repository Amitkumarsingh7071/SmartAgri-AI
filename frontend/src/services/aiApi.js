import axios from 'axios';

const aiAPI = axios.create({
  baseURL: import.meta.env.VITE_AI_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

import API from './api';

// For image upload, content-type is multipart/form-data
export const uploadImageAPI = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  // 1. Try direct Python FastAPI microservice if reachable
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_AI_URL || 'http://localhost:8000'}/api/detect-disease`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 2500
      }
    );
    if (response.data && response.data.disease_name) {
      return response.data;
    }
  } catch (err) {
    console.warn('Direct Python AI connection timed out/failed. Falling back to Express AI proxy.');
  }

  // 2. Fallback to Express backend proxy (100% uptime guaranteed)
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/disease-workflow/detect-disease`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export default aiAPI;
