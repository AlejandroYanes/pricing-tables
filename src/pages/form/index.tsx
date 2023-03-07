import { createStyles, Tabs } from '@mantine/core';

import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import AddBlock from '../../components/AddBlock';

const useStyles = createStyles(() => ({
  products: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: '16px',
    ['& > *']: {
      width: '240px',
    }
  },
}));

const FormPage = () => {
  const { classes } = useStyles();

  return (
    <BaseLayout>
      <Tabs mt="lg" defaultValue="products">
        <Tabs.List>
          <Tabs.Tab value="template">Template</Tabs.Tab>
          <Tabs.Tab value="products">Products</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="template" pt="lg">
          Templates tab content
        </Tabs.Panel>

        <Tabs.Panel value="products" pt={48}>
          <div className={classes.products}>
            <AddBlock label="Product" />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="lg">
          Settings tab content
        </Tabs.Panel>
      </Tabs>
    </BaseLayout>
  );
};

export default authGuard(FormPage);
