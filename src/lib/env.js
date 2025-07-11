// This file centralises runtime environment variables that need to be accessed in JS/TS code.

export const Env = {
  // Application name
  NAME: process.env.APP_NAME ?? 'LocalBuy',
  // Current environment (development|staging|production)
  APP_ENV: process.env.APP_ENV ?? 'development',
  // Exposed app version (string or number)
  VERSION: process.env.APP_VERSION ?? '0.0.1',
  // Expo account owner used by EAS
  EXPO_ACCOUNT_OWNER: process.env.EXPO_ACCOUNT_OWNER ?? 'eniola4049',
  // URL scheme used for deep-linking
  SCHEME: process.env.SCHEME ?? 'localbuy',
  // Native identifiers
  BUNDLE_ID: process.env.BUNDLE_ID ?? 'com.localbuy.app',
  PACKAGE: process.env.PACKAGE ?? 'com.localbuy.app',
  // EAS project id (GUID) - will be auto-generated
  EAS_PROJECT_ID: process.env.EAS_PROJECT_ID,
  // REST API base URL consumed by Axios client
  API_URL: 'https://buylocalapi-staging.up.railway.app/api', // Updated to staging backend
  // Test mode - ENABLED to test location modal feature
  TEST_MODE: 'true', // Enable test mode to test location feature
};

// Variables that are safe to embed in the public JS bundle (duplicated in app.config.ts "extra")
export const ClientEnv = {
  APP_ENV: Env.APP_ENV,
  API_URL: Env.API_URL,
  TEST_MODE: Env.TEST_MODE,
};
