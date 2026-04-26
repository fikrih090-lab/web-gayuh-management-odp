import axios from 'axios';
import { mapClient, mapOdp, mapAlert } from './mappers';

// Base API configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getClients = async () => {
  const { data } = await api.get('/clients');
  return data.map(mapClient);
};

export const createClient = async (clientData) => {
  const { data } = await api.post('/clients', clientData);
  return data;
};

export const getOdps = async () => {
  const { data } = await api.get('/network/odps');
  return data.map(mapOdp);
};

export const createOdp = async (odpData) => {
  const { data } = await api.post('/network/odps', odpData);
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
