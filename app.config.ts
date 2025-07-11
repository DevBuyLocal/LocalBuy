/* eslint-disable max-lines-per-function */
import type { ConfigContext, ExpoConfig } from '@expo/config';
import type { AppIconBadgeConfig } from 'app-icon-badge/types';

// Try to import env, fallback to default values if not available
let Env: any;
let ClientEnv: any;

try {
  const envModule = require('./env');
  Env = envModule.Env;
  ClientEnv = envModule.ClientEnv;
} catch (error) {
  // Fallback values if env.ts is not available
  Env = {
    NAME: 'Buy Local',
    SCHEME: 'localbuy',
    VERSION: '0.0.1',
    BUNDLE_ID: 'com.buylocal.development',
    PACKAGE: 'com.buylocal.development',
    APP_ENV: 'development',
  };
  ClientEnv = {
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
    PAYSTACK_PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    SECRET_KEY: process.env.EXPO_PUBLIC_SECRET_KEY || '',
    VAR_NUMBER: Number(process.env.EXPO_PUBLIC_VAR_NUMBER) || 0,
    VAR_BOOL: process.env.EXPO_PUBLIC_VAR_BOOL === 'true' || false,
    TEST_MODE: 'false',
  };
}

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.APP_ENV !== 'production',
  badges: [
    {
      text: Env.APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: 'eniola4049',
  scheme: Env.SCHEME,
  slug: 'localbuy',
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/7e2ccc54-11ec-4e83-b0dd-62039c886f58',
  },
  runtimeVersion: '1.0.0',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.BUNDLE_ID,
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2E3C4B',
    },
    package: Env.PACKAGE,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0F3D30',
        image: './assets/splash-icon.png',
        imageWidth: 315,
      },
    ],
    // Using React Native's built-in Share API instead
    [
      'react-native-vision-camera',
      {
        cameraPermissionText: `${Env.NAME} needs access to your Camera.`,
        enableCodeScanner: true,
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '1.8.0', // <-- add a version here for resolution, version can be newer depending on the Expo SDK version used in the project
        },
      },
    ],
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/DMSans-Bold.ttf',
          './assets/fonts/DMSans-Medium.ttf',
          './assets/fonts/DMSans-Regular.ttf',
        ],
      },
    ],
    'expo-localization',
    'expo-router',
    ['app-icon-badge', appIconBadgeConfig],
    ['react-native-edge-to-edge'],
  ],
  extra: {
    ...ClientEnv,
    eas: {
      // Replace "PASTE_YOUR_PROJECT_ID_HERE" with the actual project ID from expo.dev dashboard
      // Example: projectId: "12345678-1234-1234-1234-123456789012"
      projectId: '7e2ccc54-11ec-4e83-b0dd-62039c886f58',
    },
  },
});
