import { Button, Checkbox, Stack, Table, Text, TextInput } from '@mantine/core';

import type { FormProduct , Feature } from 'models/stripe';

interface Props {
  products: FormProduct[];
  features: Feature[];
  onAddNew: () => void;
  onFeatureUpdate: (featureIndex: number, nextLabel: string) => void;
  onFeatureToggle: (featureIndex: number, productId: string) => void;
}

export default function FeaturesForm(props: Props) {
  const { products, features, onAddNew, onFeatureToggle, onFeatureUpdate } = props;

  if (products.length === 0) {
    return (
      <Stack mx="auto" pt="xl" style={{ width: '30%', maxWidth: '700px' }}>
        <Text mb="xl">Please add products first</Text>
      </Stack>
    );
  }

  const doesProdHasFeature = (prodId: string, featureIndex: number) => {
    const target = features.at(featureIndex)!;
    return target.products.some((prod) => prod === prodId);
  };

  const ths = products.map((prod) => (
    <th key={prod.id}>{prod.name}</th>
  ));

  const rows = features.map((feat, index) => {
    const productsCheck = products.map((prod) => (
      <td key={prod.id}>
        <Checkbox checked={doesProdHasFeature(prod.id, index)} onClick={() => onFeatureToggle(index, prod.id)} />
      </td>
    ));
    return (
      <tr key={index}>
        <td><TextInput value={feat.name} onChange={(e) => onFeatureUpdate(index, e.target.value)} /></td>
        {productsCheck}
      </tr>
    )
  });
  return (
    <Stack mx="auto" pt="xl" style={{ width: '90%' }}>
      <Text mb="xl">Features</Text>
      <Table>
        <thead>
          <tr>
            <th>Feature</th>
            {ths}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <tfoot>
          <tr>
            <td style={{ paddingTop: '12px' }}>
              <Button variant="outline" onClick={onAddNew}>Add new feature</Button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Stack>
  );
}
