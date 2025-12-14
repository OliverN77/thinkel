import axios from 'axios';

const API_URL = 'https://thinkel.onrender.com';

export const registerUser = (data: { name: string; email: string; password: string }) =>
  axios.post(`${API_URL}/api/auth/register`, data);

export const loginUser = (data: { email: string; password: string }) =>
  axios.post(`${API_URL}/api/auth/login`, data);

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProfile = async (data: FormData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/api/auth/profile`, data, {
    headers: { 
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    },
  });
  return response.data;
};

// ============================================
// FUNCIONES ADICIONALES DE AUTENTICACIÓN
// ============================================

/**
 * Cerrar sesión
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Obtener token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};
