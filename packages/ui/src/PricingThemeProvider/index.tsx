import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import type { EmotionCache } from '@emotion/react';

interface Props {
  children: any;
  color?: string;
  colorScheme?: 'system' | 'light' | 'dark';
  withGlobalStyles?: boolean;
  withNormalizeCSS?: boolean;
  cache?: EmotionCache;
}

export function PricingThemeProvider(props: Props) {
  const { cache, colorScheme = 'system', color = 'teal', children, withNormalizeCSS = true, withGlobalStyles = true } = props;
  const systemColorScheme = useColorScheme();
  return (
    <MantineProvider
      emotionCache={cache}
      withGlobalStyles={withGlobalStyles}
      withNormalizeCSS={withNormalizeCSS}
      theme={{
        colorScheme: colorScheme === 'system' ? systemColorScheme : colorScheme,
        primaryColor: color,
        globalStyles: withGlobalStyles ? (theme) => ({
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },
          html: {
            colorScheme: theme.colorScheme,
          },
          body: {
            ...theme.fn.fontStyles(),
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          },
          a: {
            color: 'inherit',
            textDecoration: 'none',
          }
        }) : undefined,
      }}
    >
      {children}
    </MantineProvider>
  );
}
