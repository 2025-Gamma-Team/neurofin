import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { userPool } from "../config/cognito";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  financialPersonality: string;
  createdAt: string;
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
  setToken: (token: string) => void;
  clearToken: () => void;
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
          const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
          });

          const cognitoUser = new CognitoUser({
            Username: email,
            Pool: userPool,
          });

          return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
              onSuccess: (session: CognitoUserSession) => {
                const token = session.getIdToken().getJwtToken();
                const user = {
                  email: email,
                  firstName: session.getIdToken().payload["name"] || "",
                  lastName: session.getIdToken().payload["family_name"] || "",
                  financialPersonality:
                    session.getIdToken().payload[
                      "custom:financialPersonality"
                    ] || "",
                  createdAt: new Date().toISOString(),
                };
                set({
                  user,
                  token,
                  isAuthenticated: true,
                  isLoading: false,
                });
                resolve();
              },
              onFailure: (err) => {
                set({
                  error: err.message || "Error al iniciar sesión",
                  isLoading: false,
                });
                reject(err);
              },
            });
          });
        } catch (error: any) {
          set({
            error: error.message || "Error al iniciar sesión",
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
          const attributeList = [
            new CognitoUserAttribute({ Name: "name", Value: firstName }),
            new CognitoUserAttribute({ Name: "family_name", Value: lastName }),
            new CognitoUserAttribute({ Name: "email", Value: email }),
            new CognitoUserAttribute({
              Name: "custom:financialPersonality",
              Value: financialPersonality,
            }),
          ];

          return new Promise((resolve, reject) => {
            userPool.signUp(
              email,
              password,
              attributeList,
              [],
              (err, result) => {
                if (err) {
                  set({
                    error: err.message || "Error durante el registro",
                    isLoading: false,
                  });
                  reject(err);
                  return;
                }
                set({
                  isLoading: false,
                  error: null,
                });
                resolve();
              }
            );
          });
        } catch (error: any) {
          set({
            error: error.message || "Error durante el registro",
            isLoading: false,
          });
          throw error;
        }
      },
      logout: () => {
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
          cognitoUser.signOut();
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      setError: (error: string | null) => set({ error }),
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: null }),
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