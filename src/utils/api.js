import axios from 'axios';

/**
 * Base URL for API requests
 * Defaults to localhost for development if not set in environment
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Create Axios instance with default config
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Attach auth token if available
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Property API service
 */
export const propertyAPI = {
  getAll: () => api.get('/properties'),
  getById: (id) => api.get(`/properties/${id}`),
  create: (property) => api.post('/properties', property),
  update: (id, property) => api.put(`/properties/${id}`, property),
  delete: (id) => api.delete(`/properties/${id}`),
  filter: (filters) => api.get('/properties', { params: filters }),
};

/**
 * Booking API service
 */
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (booking) => api.post('/bookings', booking),
  update: (id, booking) => api.put(`/bookings/${id}`, booking),
  delete: (id) => api.delete(`/bookings/${id}`),
  filter: (filters) => api.get('/bookings', { params: filters }),
};

/**
 * User API service
 */
export const userAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  googleLogin: (token) => api.post('/auth/google', { token }),
};

export default api;