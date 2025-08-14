import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Error desconocido';

    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: errorMessage,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };

    console.error('API Error:', errorDetails);
    return Promise.reject(error);
  }
);

export default apiClient;
