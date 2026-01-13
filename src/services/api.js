import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

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
  }
};
