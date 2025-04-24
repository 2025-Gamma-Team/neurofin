declare module 'amazon-cognito-identity-js' {
  export class CognitoUserPool {
    constructor(data: { UserPoolId: string; ClientId: string });
    signUp(
      username: string,
      password: string,
      attributeList: CognitoUserAttribute[],
      validationData: any[],
      callback: (err: Error | null, result: any) => void
    ): void;
  }

  export class CognitoUserAttribute {
    constructor(data: { Name: string; Value: string });
  }

  export class CognitoUser {
    constructor(data: { Username: string; Pool: CognitoUserPool });
    confirmRegistration(
      code: string,
      forceAliasCreation: boolean,
      callback: (err: Error | null, result: any) => void
    ): void;
    resendConfirmationCode(callback: (err: Error | null, result: any) => void): void;
    authenticateUser(
      authenticationDetails: AuthenticationDetails,
      callbacks: {
        onSuccess: (result: any) => void;
        onFailure: (err: Error) => void;
      }
    ): void;
  }

  export class AuthenticationDetails {
    constructor(data: { Username: string; Password: string });
  }
} 