import axios from 'axios';
import { mapClient, mapOdp, mapAlert } from './mappers';

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Original — returns plain array (dipakai oleh Dashboard, Detail, Modal, dll)
export const getClients = async () => {
  const { data } = await api.get('/clients', { params: { page: 1, limit: 9999 } });
  return data.data.map(mapClient);
};

export const createClient = async (clientData) => {
  const { data } = await api.post('/clients', clientData);
  return data;
};

export const getOdpCodes = async () => {
  const { data } = await api.get('/clients/odp-codes');
  return data; // array of strings like ['AA1', 'AA2', ...]
};

// Original — returns plain array
export const getOdps = async () => {
  const { data } = await api.get('/network/odps', { params: { page: 1, limit: 9999 } });
  return data.data.map(mapOdp);
};

// Paginated versions — dipakai oleh ClientsPage dan ODPPage
export const getClientsPaged = async ({ page = 1, limit = 50, search = '' } = {}) => {
  const { data } = await api.get('/clients', { params: { page, limit, search } });
  return {
    data: data.data.map(mapClient),
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
  };
};

export const getOdpsPaged = async ({ page = 1, limit = 50, search = '', letter = '' } = {}) => {
  const { data } = await api.get('/network/odps', { params: { page, limit, search, letter } });
  return {
    data: data.data.map(mapOdp),
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
  };
};

export const createOdp = async (odpData) => {
  const { data } = await api.post('/network/odps', odpData);
  return data;
};

export const updateOdp = async (id, odpData) => {
  const { data } = await api.put(`/network/odps/${encodeURIComponent(id)}`, odpData);
  return data;
};

export const getAlerts = async () => {
  const { data } = await api.get('/alerts');
  return data.map(mapAlert);
};

export const getFinanceStats = async () => {
  const { data } = await api.get('/finance/stats');
  return data;
};

// Fallback methods for missing mappings
export const getPaths = async () => {
  try {
      const { data } = await api.get('/network/odcs');
      return data.map(odc => ({
        id: `PATH-${odc.idOdc}`,
        name: odc.codeOdc || 'Jalur ODC',
        from: 'OLT Pusat',
        to: 'ODP',
        distance: 0,
        cableType: 'FO',
        hasRedundancy: false,
        status: 'active',
        odpIds: [],
        coordinates: [
            [Number(odc.latitude) || 0, Number(odc.longitude) || 0],
            [Number(odc.latitude) + 0.001 || 0, Number(odc.longitude) + 0.001 || 0],
        ]
      }));
  } catch(e) {
      return [];
  }
};

export const deleteClient = async (id) => {
  const { data } = await api.delete(`/clients/${encodeURIComponent(id)}`);
  return data;
};

export const deleteOdp = async (id) => {
  const { data } = await api.delete(`/network/odps/${encodeURIComponent(id)}`);
  return data;
};

// Auth API
export const login = async (username, password) => {
  const { data } = await api.post('/auth/login', { username, password });
  return data;
};

// User API
export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const createUser = async (userData) => {
  const { data } = await api.post('/users', userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
