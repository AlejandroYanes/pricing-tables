import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';

interface Props {
  colorScheme?: 'system' | 'light' | 'dark';
  children: ReactNode;
}

export function PricingThemeProvider(props: Props) {
  const { colorScheme = 'system', children } = props;
  const systemColorScheme = useColorScheme();
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: colorScheme === 'system' ? systemColorScheme : colorScheme,
        primaryColor: 'teal',
        globalStyles: (theme) => ({
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
        }),
      }}
    >
      {children}
    </MantineProvider>
  );
}
