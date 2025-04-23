import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  financialPersonality: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    financialPersonality: string
  ) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          if (response.data.success) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "Credenciales inválidas",
            isLoading: false,
          });
          throw error;
        }
      },
      register: async (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        financialPersonality: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/register", {
            firstName,
            lastName,
            email,
            password,
            financialPersonality,
          });

          if (response.data.success) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 
                             error.response?.data?.error_message ||
                             "Error durante el registro";
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          });
          throw new Error(errorMessage);
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
