import axios from 'axios';

const aiAPI = axios.create({
  baseURL: import.meta.env.VITE_AI_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// For image upload, content-type is multipart/form-data
export const uploadImageAPI = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axios.post(
    `${import.meta.env.VITE_AI_URL || 'http://localhost:8000'}/api/detect-disease`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export default aiAPI;
