import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Products
  getProducts: async () => {
    const res = await axios.get(`${API_URL}/products`);
    return res.data;
  },
  
  createProduct: async (product) => {
    const res = await axios.post(`${API_URL}/products`, product);
    return res.data;
  },

  updateProduct: async (id, product) => {
    const res = await axios.put(`${API_URL}/products/${id}`, product);
    return res.data;
  },

  deleteProduct: async (id) => {
    await axios.delete(`${API_URL}/products/${id}`);
  },

  // Settings & Layout
  getSetting: async (key) => {
    const res = await axios.get(`${API_URL}/settings/${key}`);
    return res.data;
  },

  saveSetting: async (key, value) => {
    await axios.post(`${API_URL}/settings`, { key, value });
  },

  // Orders
  createOrder: async (orderData) => {
    const res = await axios.post(`${API_URL}/orders`, orderData);
    return res.data;
  },

  getOrders: async () => {
    const res = await axios.get(`${API_URL}/orders`);
    return res.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await axios.put(`${API_URL}/orders/${orderId}`, { status });
    return res.data;
  },

  // Auth
  register: async (userData) => {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
  },

  login: async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data;
  },

  updateProfile: async (userId, profileData) => {
    const res = await axios.put(`${API_URL}/auth/profile/${userId}`, profileData);
    return res.data;
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    const res = await axios.put(`${API_URL}/auth/password/${userId}`, { currentPassword, newPassword });
    return res.data;
  },

  getUserOrders: async (userId) => {
    const res = await axios.get(`${API_URL}/auth/orders/${userId}`);
    return res.data;
  }
};
