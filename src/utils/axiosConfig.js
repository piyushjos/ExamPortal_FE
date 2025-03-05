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
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout - please try again'));
    }
    
    if (!error.response) {
      return Promise.reject(new Error('Network error - please check your connection'));
    }

    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 400:
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

axiosInstance.interceptors.request.use((config) => {
  const role = localStorage.getItem('role');
  if (role === 'INSTRUCTOR') {
    const email = localStorage.getItem('email');
    config.headers['X-User-Email'] = email;
  }
  return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.request.use(
  (config) => {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    if (role === 'STUDENT' && email) {
      config.headers['X-User-Email'] = email;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



export default axiosInstance; 