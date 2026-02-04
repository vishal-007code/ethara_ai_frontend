import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Extract error message from error response
 * Handles different error response formats (FastAPI, Express, etc.)
 */
export const getErrorMessage = (error) => {
  if (!error) {
    return 'An unexpected error occurred';
  }

  // Handle axios error response
  if (error.response) {
    const { data, status } = error.response;
    
    // FastAPI format: { detail: "message" }
    if (data?.detail) {
      return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    }
    
    // Express format: { message: "message" }
    if (data?.message) {
      return data.message;
    }
    
    // Validation errors: { errors: [...] }
    if (data?.errors && Array.isArray(data.errors)) {
      return data.errors.map(err => err.message || err).join(', ');
    }
    
    // Generic error object
    if (typeof data === 'string') {
      return data;
    }
    
    // Status-based messages
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Unauthorized. Please check your credentials.';
      case 403:
        return 'Forbidden. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict. This resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return `Request failed with status ${status}`;
    }
  }
  
  // Network error (no response received)
  if (error.request) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'Request timeout. Please check your connection and try again.';
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }
    return 'Unable to connect to the server. Please check your connection.';
  }
  
  // Request setup error
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Request interceptor - Add logging and modify requests
 */
api.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors and format responses
 */
api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Format error with consistent structure
    const errorMessage = getErrorMessage(error);
    
    // Log error for debugging
    if (error.response) {
      console.error('[API Error]', {
        status: error.response.status,
        url: error.config?.url,
        method: error.config?.method,
        message: errorMessage,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('[Network Error]', {
        url: error.config?.url,
        method: error.config?.method,
        message: errorMessage,
        code: error.code,
      });
    } else {
      console.error('[Request Setup Error]', {
        message: errorMessage,
        error: error.message,
      });
    }
    
    // Attach formatted error message to error object
    error.formattedMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

// Employees API
export const employeesAPI = {
  getAll: () => api.get('/api/employees'),
  getById: (id) => api.get(`/api/employees/${id}`),
  create: (employee) => api.post('/api/employees', employee),
  delete: (id) => api.delete(`/api/employees/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: (params) => api.get('/api/attendance', { params }),
  getByEmployeeId: (employeeId) => api.get(`/api/attendance/employee/${employeeId}`),
  create: (attendance) => {
    // Ensure backend receives a stable payload shape even if callers pass partial data.
    const payload = {
      employeeId: attendance?.employeeId,
      date: attendance?.date,
      status: attendance?.status || 'Present',
    };
    return api.post('/api/attendance', payload);
  },
  getStats: (employeeId) => api.get(`/api/attendance/stats/${employeeId}`),
};

export default api;
