import { fetchApi } from './api';

export const authService = {
  login: async (credentials) => {
    // credentials = { username, password }
    const response = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  },

  register: async (userData) => {
    // userData = { username, email, password, nombre, apellido }
    const response = await fetchApi('/auth/registro', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  getProfile: async () => {
    const response = await fetchApi('/auth/me', {
      method: 'GET',
    });
    return response;
  }
};
