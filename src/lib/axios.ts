import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

declare global {
  interface Window {
    _keycloak: any;
  }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  console.error('❌ NEXT_PUBLIC_API_URL is not defined!');
}

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    try {

      // Primero intentamos obtener el token de Keycloak directamente
      const kc = window._keycloak;
      if (kc?.token) {
        config.headers.set('Authorization', `Bearer ${kc.token}`);
      } else {
        // Si no hay token en Keycloak, intentamos obtenerlo del localStorage
        const token = localStorage.getItem('kc_token');
        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else {
          console.warn('⚠️ No token available for request');
        }
      }
    } catch (error) {
      console.error('❌ Error in request interceptor:', error);
    }
    console.groupEnd();
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('Received 401 error, attempting token refresh');
      try {
        const kc = window._keycloak;
        if (kc) {
          console.log('Attempting to refresh token');
          const refreshed = await kc.updateToken(70);
          
          if (refreshed) {
            console.log('Token refreshed successfully');
            localStorage.setItem('kc_token', kc.token);
            if (error.config) {
              error.config.headers.set('Authorization', `Bearer ${kc.token}`);
              console.log('Retrying request with new token');
              return apiClient(error.config);
            }
          } else {
            console.log('Token refresh failed or not needed');
          }
        }
      } catch (refreshError) {
        console.error('❌ Token refresh error:', refreshError);
        localStorage.removeItem('kc_token');
        window.location.href = '/';
      }
    }
    console.groupEnd();
    return Promise.reject(error);
  }
);


export default apiClient; 