// api.js centraliza todas las llamadas a la API
const API_URL = 'http://localhost:8080/api';

const getHeaders = (token, isFormData = false) => {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = getHeaders(token, options.body instanceof FormData);

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error en la petición al servidor');
    }
    
    // El backend podría devolver empty en 204 o similares
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('Error in fetchApi:', error);
    throw error;
  }
};

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`;
  return url;
};
