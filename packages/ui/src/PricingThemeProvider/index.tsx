import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';

interface Props {
  children: any;
  colorScheme?: 'system' | 'light' | 'dark';
  withGlobalStyles?: boolean;
  withNormalizeCSS?: boolean;
}

export function PricingThemeProvider(props: Props) {
  const { colorScheme = 'system', children, withNormalizeCSS = true, withGlobalStyles = true } = props;
  const systemColorScheme = useColorScheme();
  return (
    <MantineProvider
      withGlobalStyles={withGlobalStyles}
      withNormalizeCSS={withNormalizeCSS}
      theme={{
        colorScheme: colorScheme === 'system' ? systemColorScheme : colorScheme,
        primaryColor: 'teal',
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
