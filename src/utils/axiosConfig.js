import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // Add timeout
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout - please try again'));
    }
    
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error - please check your connection'));
    }

    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          window.location.href = '/';
          break;
        default:
          console.error('Server Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 