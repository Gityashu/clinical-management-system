import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = import.meta.env.VITE_JWT_TOKEN_KEY || 'clinic_jwt_token';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  register: (userData) =>
    api.post('/auth/register', userData),
  verifyToken: () =>
    api.get('/auth/verify'),
};

// ============ PATIENT ENDPOINTS ============
export const patientAPI = {
  register: (patientData) =>
    api.post('/patients/register', patientData),
  getAll: (page = 1, limit = 10) =>
    api.get(`/patients?page=${page}&limit=${limit}`),
  getById: (id) =>
    api.get(`/patients/${id}`),
  search: (searchTerm) =>
    api.get(`/patients/search?search=${searchTerm}`),
  update: (id, data) =>
    api.put(`/patients/${id}`, data),
  delete: (id) =>
    api.delete(`/patients/${id}`),
};

// ============ APPOINTMENT ENDPOINTS ============
export const appointmentAPI = {
  create: (appointmentData) =>
    api.post('/appointments', appointmentData),
  getAll: (page = 1, limit = 10, filters = {}) => {
    let url = `/appointments?page=${page}&limit=${limit}`;
    if (filters.patientId) url += `&patientId=${filters.patientId}`;
    if (filters.doctorId) url += `&doctorId=${filters.doctorId}`;
    return api.get(url);
  },
  getById: (id) =>
    api.get(`/appointments/${id}`),
  update: (id, data) =>
    api.put(`/appointments/${id}`, data),
  cancel: (id) =>
    api.put(`/appointments/${id}/cancel`, {}),
};

// ============ DOCTOR ENDPOINTS ============
export const doctorAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/doctors?page=${page}&limit=${limit}`),
  getById: (id) =>
    api.get(`/doctors/${id}`),
  getByDepartment: (deptId) =>
    api.get(`/doctors/department/${deptId}`),
  getAvailable: (date) =>
    api.get(`/doctors/available/check?date=${date}`),
};

// ============ PHARMACY ENDPOINTS ============
export const pharmacyAPI = {
  getMedicines: (page = 1, limit = 20) =>
    api.get(`/pharmacy/medicines?page=${page}&limit=${limit}`),
  getMedicineById: (id) =>
    api.get(`/pharmacy/medicines/${id}`),
  searchMedicines: (searchTerm) =>
    api.get(`/pharmacy/medicines/search/query?search=${searchTerm}`),
  updateStock: (medicineId, quantity) =>
    api.put(`/pharmacy/stock/${medicineId}`, { quantity }),
  getLowStockAlert: () =>
    api.get(`/pharmacy/alerts/low-stock`),
  getExpiredMedicines: () =>
    api.get(`/pharmacy/alerts/expired`),
};

// ============ DASHBOARD ENDPOINTS ============
export const dashboardAPI = {
  getStats: () =>
    api.get('/dashboard/stats'),
  getTodayAppointments: () =>
    api.get('/dashboard/today-appointments'),
  getRecentPatients: () =>
    api.get('/dashboard/recent-patients'),
};

export default api;
