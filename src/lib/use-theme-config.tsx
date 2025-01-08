import type { Theme } from '@react-navigation/native';
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

import colors from '@/components/ui/colors';
type TExtendedColors = {
  colors: {
    primaryText: string;
  };
};

const DarkTheme: Theme & TExtendedColors = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: '#EC9F01',
    primaryText: '#FFFFFF',
    // primary: colors.primary[200],
    background: colors.charcoal[950],
    text: colors.charcoal[100],
    border: colors.charcoal[500],
    card: colors.charcoal[850],
  },
};

const LightTheme: Theme & TExtendedColors = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#EC9F01',
    primaryText: '#EC9F01',
    // primary: colors.primary[400],
    background: colors.white,
  },
};

export function useThemeConfig() {
  const { colorScheme } = useColorScheme();

  if (colorScheme === 'dark') return DarkTheme;

  return LightTheme;
}
