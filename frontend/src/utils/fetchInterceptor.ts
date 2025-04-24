import { useAuthStore } from '../store/authStore';

const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    const response = await originalFetch(input, init);
    
    if (response.status === 401 || response.status === 403) {
      // Hacer logout completo y redirigir al login
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject('Sesión expirada');
    }
    
    return response;
  } catch (error) {
    if (error === 'Sesión expirada') {
      return Promise.reject(error);
    }
    
    // Si es un error de red u otro tipo, verificamos si tenemos token
    const token = useAuthStore.getState().token;
    if (!token) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject('No hay sesión activa');
    }
    
    return Promise.reject(error);
  }
};

export default window.fetch; 