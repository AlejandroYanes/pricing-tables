import type { ReactNode } from 'react';
import { createStyles } from '@mantine/core';

import { CustomNavbar } from 'components/Navbar';

const useStyles = createStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 48px 24px',
  },
}));

interface Props {
  children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { children } = props;
  const { classes } = useStyles();

  return (
    <section className={classes.wrapper}>
      <CustomNavbar />
      {children}
    </section>
  );
};

export default BaseLayout;
