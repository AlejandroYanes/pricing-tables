import type { ReactNode } from 'react';
import { createStyles } from '@mantine/core';
import { RenderIf } from 'ui';

import { CustomNavbar } from 'components/Navbar';

const useStyles = createStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 48px 24px',
    position: 'relative',
  },
}));

interface Props {
  hideNavbar?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  title?: string;
  children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { hideNavbar = false, children, ...rest } = props;
  const { classes } = useStyles();

  return (
    <section className={classes.wrapper}>
      <RenderIf condition={!hideNavbar}>
        <CustomNavbar {...rest} />
      </RenderIf>
      {children}
    </section>
  );
};

export default BaseLayout;
