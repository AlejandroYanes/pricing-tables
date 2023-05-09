import type { Feature } from '@prisma/client';
import { Button, useMantineTheme } from '@mantine/core';

import { trpc } from 'utils/trpc';
import useChangeHistory from './useChangeHistory';

interface Props {
  widgetId: string;
  enabled?: boolean;
}

export default function SaveButton(props: Props) {
  const theme = useMantineTheme();
  const { widgetId, enabled } = props;
  const { shouldSave, changes } = useChangeHistory(enabled);

  const { mutate } = trpc.widgets.updateWidget.useMutation();

  const handleSave = () => {
    const { features, selectedProducts, ...rest } = changes;

    let featureUpdates;

    if (features) {
      featureUpdates = Object.values(features).reduce((list, feature) => {
        const flattened = feature.products.map((prod) => ({
          id: feature.id,
          name: feature.name,
          type: feature.type,
          value: prod.value,
          productId: prod.id,
        }));
        return list.concat(flattened as Feature[]);
      }, [] as Feature[]);
    }

    console.log('changes to save', { widgetId, features: featureUpdates, products: selectedProducts, ...rest });

    // mutate({ widgetId, features: featureUpdates, products: selectedProducts, ...rest });
  }

  if (!shouldSave) return null;

  return (
    <Button color="dark" variant={theme.colorScheme === 'dark' ? 'white' : 'filled'} onClick={handleSave}>
      Save
    </Button>
  );
}
