import type { ReactNode } from 'react';
import Link from 'next/link';
import { createStyles } from '@mantine/core';
import { RenderIf } from 'ui';

import { CustomNavbar } from 'components/Navbar';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 48px 24px',
    position: 'relative',
    minHeight: '100vh',
    [theme.fn.smallerThan('md')]: {
      padding: '0 20px 48px',
    },
    [theme.fn.smallerThan('xs')]: {
      padding: '0 20px 24px',
    },
  },
  spacer: {
    marginTop: 'auto',
  },
  footer: {
    marginTop: '64px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '32px',
    padding: '0 48px',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
  },
}));

interface Props {
  hideNavbar?: boolean;
  hideFooter?: boolean;
  hideUserControls?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  title?: string;
  children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { hideNavbar = false, hideFooter, children, ...rest } = props;
  const { classes } = useStyles();

  return (
    <section className={classes.wrapper}>
      <RenderIf condition={!hideNavbar}>
        <CustomNavbar {...rest} />
      </RenderIf>
      {children}
      <div className={classes.spacer} />
      <RenderIf condition={!hideFooter}>
        <footer className={classes.footer}>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </footer>
      </RenderIf>
    </section>
  );
};

export default BaseLayout;
