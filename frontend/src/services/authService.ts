import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { useAuthStore } from "../store/authStore";
import api from "../utils/api";

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

export const authService = {
  async signUp(email: string, password: string) {
    try {
      const response = await api.post("/auth/signup", { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async confirmSignUp(email: string, code: string) {
    try {
      const response = await api.post("/auth/confirm", { email, code });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const response = await api.post("/auth/signin", { email, password });
      const { token, user } = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem("token", token);
      
      // Actualizar el store
      const login = useAuthStore.getState().login;
      login(user, token);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async signOut() {
    try {
      await api.post("/auth/signout");
      // Limpiar localStorage y store
      localStorage.clear();
      const logout = useAuthStore.getState().logout;
      logout();
    } catch (error) {
      // Aún si hay error, limpiamos el estado local
      localStorage.clear();
      const logout = useAuthStore.getState().logout;
      logout();
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};