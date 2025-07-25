import { getItem, removeItem, setItem } from '@/lib/storage';

const TOKEN = 'token';

export type TokenType = {
  access: string;
  refresh: string;
};

export const getToken = (): TokenType | null => {
  const token = getItem<TokenType>(TOKEN);
  return token;
};
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => {
  setItem<TokenType>(TOKEN, value);
};
