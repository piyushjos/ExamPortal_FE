import axiosInstance from '../utils/axiosConfig';

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data?.message || 'Server error occurred');
  } else if (error.request) {
    // Request made but no response
    throw new Error('No response from server');
  } else {
    // Something else went wrong
    throw new Error('Error setting up request');
  }
};

const api = {
  auth: {
    login: async (credentials) => {
      try {
        const response = await axiosInstance.post('/api/auth/login', {
          email: credentials.email,
          password: credentials.password
        });
        // Log the response for debugging
        console.log('Login response:', response.data);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    },
    register: async (userData) => {
      try {
        // For student registration, set role automatically
        const dataWithRole = {
          ...userData,
          role: { roleName: "STUDENT" }
        };
        const response = await axiosInstance.post('/api/auth/register', dataWithRole);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
  },
  admin: {
    addInstructor: async (instructorData) => {
      try {
        console.log('Adding instructor with data:', instructorData);
        const response = await axiosInstance.post('/api/admin/instructors', {
          email: instructorData.email,
          password: instructorData.password,
          role: null  // Let the backend set the role
        });
        return response.data;
      } catch (error) {
       
        throw new Error(error.response?.data?.message || 'Failed to add instructor');
      }
    },
    removeInstructor: async (id) => {
      try {
        const response = await axiosInstance.delete(`/api/admin/instructors/${id}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    getAllUsers: async () => {
      try {
        const response = await axiosInstance.get('/api/admin/users');
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    getAnalytics: async () => {
      try {
        const response = await axiosInstance.get('/api/admin/analytics');
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
  },
  instructor: {
    createCourse: async (courseData) => {
      try {
        const response = await axiosInstance.post('/api/instructor/courses', courseData);
        console.log("create course===>" ,response.data)
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    updateCourse: async (id, courseData) => {
      try {
        const response = await axiosInstance.put(`/api/instructor/courses/${id}`, courseData);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    deleteCourse: async (id) => {
      try {
        const response = await axiosInstance.delete(`/api/instructor/courses/${id}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    createExam: async (examData) => {
      try {
        const response = await axiosInstance.post('/api/instructor/exams', examData);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    getExamResults: async (examId) => {
      try {
        const response = await axiosInstance.get(`/api/instructor/exams/${examId}/results`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
  },
  student: {
    getEnrolledCourses: async () => {
      try {
        const response = await axiosInstance.get('/api/students/courses');
        console.log('Enrolled courses response:', response.data);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        return [];
      }
    },
    getAvailableExams: async () => {
      try {
        const response = await axiosInstance.get('/api/students/exams');
        console.log('Available exams response:', response.data);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        return [];
      }
    },
    getExamDetails: async (examId) => {
      try {
        const response = await axiosInstance.get(`/api/students/exams/${examId}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    submitExam: async (examId, answers) => {
      try {
        const response = await axiosInstance.post(`/api/students/exams/${examId}/submit`, answers);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    getResults: async () => {
      try {
        const response = await axiosInstance.get('/api/students/results');
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
  },
};

export default api;
