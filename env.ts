import {
  ClientEnv as RuntimeClientEnv,
  Env as RuntimeEnv,
} from './src/lib/env.js';

export const Env = RuntimeEnv;
export const ClientEnv = RuntimeClientEnv;

export type EnvType = typeof Env;
export type ClientEnvType = typeof ClientEnv;

const _clientEnv = {
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  PAYSTACK_PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY,
  SECRET_KEY: process.env.EXPO_PUBLIC_SECRET_KEY,
  VAR_NUMBER: Number(process.env.EXPO_PUBLIC_VAR_NUMBER),
  VAR_BOOL: process.env.EXPO_PUBLIC_VAR_BOOL === 'true',
  TEST_MODE: 'false', // Connect to real backend server
};
