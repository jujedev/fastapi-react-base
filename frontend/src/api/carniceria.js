// src/api/carniceria.js
import { api } from './client';
 
export const productosApi = {
  getAll: () => api.get('/productos/').then((r) => r.data),
};
 
export const ventasApi = {
  registrar: (payload) => api.post('/ventas/', payload).then((r) => r.data),
  getAll: () => api.get('/ventas/').then((r) => r.data),
  anular: (id) => api.delete(`/ventas/${id}`),
  reporteDiario: (fecha = null) => {
    const params = fecha ? { fecha } : {};
    return api.get('/ventas/reporte-diario', { params }).then((r) => r.data);
  },
};