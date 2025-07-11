declare module '@env' {
  export const Env: {
    NAME: string;
    APP_ENV: string;
    VERSION: string | number;
    EXPO_ACCOUNT_OWNER: string;
    SCHEME: string;
    BUNDLE_ID: string;
    PACKAGE: string;
    EAS_PROJECT_ID: string;
    API_URL: string;
    TEST_MODE: string;
  };

  export const ClientEnv: {
    APP_ENV: string;
    API_URL: string;
    TEST_MODE: string;
  };
}
