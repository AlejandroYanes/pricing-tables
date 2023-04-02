import { createStyles, Group, Title } from '@mantine/core';

import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import AddBlock from 'components/AddBlock';
import Link from 'next/link';

const useStyles = createStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
}));

const DashboardPage = () => {
  const { classes } = useStyles();
  return (
    <BaseLayout>
      <Group position="apart" align="center" mb="xl">
        <Title>Dashboard</Title>
      </Group>
      <div className={classes.grid}>
        <Link href="/form">
          <AddBlock label="Add New Table" />
        </Link>
      </div>
    </BaseLayout>
  );
};

export default authGuard(DashboardPage);
