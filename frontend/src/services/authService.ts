import { userPool } from "@/config/cognito";
import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute,
  } from "amazon-cognito-identity-js";
  
  
  export const authService = {
    signUp: async (
      email: string,
      password: string,
      name: string,
      phone_number: string
    ) => {
      return new Promise((resolve, reject) => {
        const attributeList = [
          new CognitoUserAttribute({ Name: "email", Value: email }),
          new CognitoUserAttribute({ Name: "name", Value: name }),
          new CognitoUserAttribute({ Name: "phone_number", Value: phone_number }),
        ];
  
        userPool.signUp(email, password, attributeList, [], (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    },
  
    confirmSignUp: async (email: string, code: string) => {
      return new Promise((resolve, reject) => {
        const cognitoUser = new CognitoUser({
          Username: email,
          Pool: userPool,
        });
  
        cognitoUser.confirmRegistration(code, true, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    },
  
    signIn: async (email: string, password: string) => {
      return new Promise((resolve, reject) => {
        const authenticationDetails = new AuthenticationDetails({
          Username: email,
          Password: password,
        });
  
        const cognitoUser = new CognitoUser({
          Username: email,
          Pool: userPool,
        });
  
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            resolve({
              token: result.getIdToken().getJwtToken(),
              user: cognitoUser,
            });
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });
    },
  
    signOut: () => {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
      }
    },
  
    getCurrentUser: () => {
      return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser();
  
        if (!cognitoUser) {
          resolve(null);
          return;
        }
  
        cognitoUser.getSession((err: any, session: any) => {
          if (err) {
            reject(err);
            return;
          }
  
          if (session.isValid()) {
            resolve({
              user: cognitoUser,
              token: session.getIdToken().getJwtToken(),
            });
          } else {
            resolve(null);
          }
        });
      });
    },
  
    resendConfirmationCode: async (email: string) => {
      return new Promise((resolve, reject) => {
        const cognitoUser = new CognitoUser({
          Username: email,
          Pool: userPool,
        });
  
        cognitoUser.resendConfirmationCode((err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    },
  };