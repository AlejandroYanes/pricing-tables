import { ColorInput, Select, Text } from '@mantine/core';

import type { FormProduct } from 'models/stripe';

interface Props {
  products: FormProduct[];
  recommended: string | undefined;
  onRecommendedChange: (next: string) => void;
  color: string;
  onColorChange: (next: string) => void;
}

export default function VisualsForm(props: Props) {
  const { products, recommended, onRecommendedChange, color, onColorChange } = props;

  const options = products.map((prod) => ({ label: prod.name, value: prod.id }));

  if (options.length === 0) {
    return (
      <>
        <Text mb="xl">Visuals</Text>
        <Text>Please add some products first</Text>
      </>
    );
  }

  return (
    <>
      <Text mb="xl">Visuals</Text>
      <Select label="Recommended Product" data={options} value={recommended} onChange={onRecommendedChange} />
      <ColorInput placeholder="Pick color" label="Highlight color" value={color} onChange={onColorChange} />
    </>
  );
}
