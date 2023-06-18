import type { ReactNode } from 'react';
import { createStyles } from '@mantine/core';
import { RenderIf } from 'ui';

import { CustomNavbar } from 'components/Navbar';

// const useStyles = createStyles((theme) => ({
//   wrapper: {
//     display: 'flex',
//     flexDirection: 'column',
//     padding: '0 48px 24px',
//     position: 'relative',
//     [theme.fn.smallerThan('md')]: {
//       padding: '0 20px 48px',
//     },
//     [theme.fn.smallerThan('xs')]: {
//       padding: '0 20px 24px',
//     },
//   },
// }));

interface Props {
  hideNavbar?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  title?: string;
  children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { hideNavbar = false, children, ...rest } = props;

  return (
    <section className="flex flex-col relative pt-0 px-12 pb-6">
      <RenderIf condition={!hideNavbar}>
        <CustomNavbar {...rest} />
      </RenderIf>
      {children}
    </section>
  );
};

export default BaseLayout;
