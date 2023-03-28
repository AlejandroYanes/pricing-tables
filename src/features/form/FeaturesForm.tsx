import { Button, Checkbox, Select, Stack, Table, Text, TextInput } from '@mantine/core';

import type { FormProduct, Feature, FeatureValue, FeatureType } from 'models/stripe';

interface Props {
  products: FormProduct[];
  features: Feature[];
  onAddNew: () => void;
  onFeatureLabelUpdate: (featureIndex: number, nextLabel: string) => void;
  onFeatureTypeChange: (featureIndex: number, nextType: FeatureType) => void;
  onFeatureValueChange: (featureIndex: number, productId: string, nextValue: FeatureValue) => void;
}

const resolveFeatureValue = (features: Feature[], prodId: string, featureIndex: number) => {
  const target = features.at(featureIndex)!;
  return target.products.find((prod) => prod.id === prodId)!.value;
};

const featureTypeOptions: { label: string; value: FeatureType }[] = [
  { label: 'Boolean', value: 'boolean' },
  { label: 'Text', value: 'string' },
  { label: 'Currency', value: 'currency' },
];

export default function FeaturesForm(props: Props) {
  const { products, features, onAddNew, onFeatureLabelUpdate, onFeatureTypeChange, onFeatureValueChange } = props;

  if (products.length === 0) {
    return (
      <Stack mx="auto" pt="xl" style={{ width: '30%', maxWidth: '700px' }}>
        <Text mb="xl">Please add products first</Text>
      </Stack>
    );
  }

  const ths = products.map((prod) => (
    <th key={prod.id}>{prod.name}</th>
  ));

  const rows = features.map((feat, index) => {
    const productsCheck = products.map((prod) => {
      const value = resolveFeatureValue(features, prod.id, index);
      return (
        <td key={prod.id}>
          <Checkbox
            checked={value as boolean}
            onChange={() => undefined}
            onClick={() => onFeatureValueChange(index, prod.id, !value)}
          />
        </td>
      )
    });
    return (
      <tr key={index}>
        <td width={360}><TextInput value={feat.name} onChange={(e) => onFeatureLabelUpdate(index, e.target.value)} /></td>
        <td width={200}>
          <Select
            data={featureTypeOptions}
            value={feat.type}
            onChange={(value: string) => onFeatureTypeChange(index, value as FeatureType)}
          />
        </td>
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
            <th>Type</th>
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
