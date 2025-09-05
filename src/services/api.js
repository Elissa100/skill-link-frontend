import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 with refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
          const { accessToken } = data.data;
          localStorage.setItem('token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    // Show toast for errors
    if (error.response?.status >= 400) {
      const message = error.response.data?.message || 'An error occurred';
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// ===== Auth Services =====
export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  verifyEmail: (userId, code) => api.post('/api/auth/verify-email', { userId, code }),
  resendVerification: (userId) => api.post('/api/auth/resend-verification', { userId }),
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  getCurrentUser: () => api.get('/api/auth/me'),
  refreshToken: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
};

// ===== User Services =====
export const userService = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getAllUsers: () => api.get('/api/users'),
};

// ===== Task Services =====
export const taskService = {
  getAllTasks: (filters) => api.get('/api/tasks', { params: filters }),
  getTaskById: (id) => api.get(`/api/tasks/${id}`),
  createTask: (taskData) => {
    // Use FormData if attachments exist
    if (taskData.attachments && taskData.attachments.length > 0) {
      const formData = new FormData();
      Object.keys(taskData).forEach((key) => {
        if (key === 'attachments') {
          taskData[key].forEach((file) => formData.append('attachments', file));
        } else {
          formData.append(key, taskData[key]);
        }
      });
      return api.post('/api/tasks', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/api/tasks', taskData);
  },
  updateTask: (id, data) => api.put(`/api/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),
  getUserTasks: () => api.get('/api/tasks/my/tasks'),
};

// ===== Bid Services =====
export const bidService = {
  createBid: (taskId, bidData) => api.post(`/api/bids/task/${taskId}`, bidData),
  getTaskBids: (taskId) => api.get(`/api/bids/task/${taskId}`),
  acceptBid: (bidId) => api.post(`/api/bids/${bidId}/accept`),
  getUserBids: () => api.get('/api/bids/my/bids'),
};

// ===== Message Services =====
export const messageService = {
  getTaskMessages: (taskId) => api.get(`/api/messages/task/${taskId}`),
  sendMessage: (taskId, content) => api.post(`/api/messages/task/${taskId}`, { content }),
  markAsRead: (messageId) => api.patch(`/api/messages/${messageId}/read`),
};

// ===== Payment Services =====
export const paymentService = {
  createPaymentIntent: (taskId, milestoneId) =>
    api.post('/api/payments/create-intent', { taskId, milestoneId }),
  getPaymentHistory: () => api.get('/api/payments/history'),
};

// ===== Notification Services =====
export const notificationService = {
  getNotifications: (page, limit) => api.get('/api/notifications', { params: { page, limit } }),
  markAsRead: (notificationId) => api.patch(`/api/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/api/notifications/mark-all-read'),
};

export default api;
