import { useAuthStore } from '../store/authStore';

const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  // Agregar el token a todas las peticiones si existe
  const token = useAuthStore.getState().token;
  if (token) {
    init = {
      ...init,
      headers: {
        ...init?.headers,
        'Authorization': `Bearer ${token}`
      }
    };
  }

  try {
    const response = await originalFetch(input, init);
    
    if (response.status === 401) {
      // Hacer logout y redirigir al login
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject('Sesión expirada');
    }
    
    return response;
  } catch (error) {
    if (error === 'Sesión expirada') {
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
};

export default window.fetch; 