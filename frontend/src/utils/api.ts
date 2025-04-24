import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: 'https://xr601d9sn5.execute-api.us-east-1.amazonaws.com/prod',
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Agregar logs para debugging
      console.log('Token agregado a la petición:', token);
      console.log('URL de la petición:', config.url);
      console.log('Headers completos:', config.headers);
    } else {
      console.warn('No se encontró token en el store');
      // Si no hay token, redirigir al login
      window.location.href = "/login";
      return Promise.reject("No token found");
    }
    return config;
  },
  (error) => {
    console.error('Error en el interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    // Log para debugging
    console.log('Respuesta exitosa:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('Error 401 detectado - Iniciando logout');
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
