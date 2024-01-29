'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface Props {
  children: any;
}

export default function ThemeProvider(props: Props) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {props.children}
    </NextThemesProvider>
  );
}
