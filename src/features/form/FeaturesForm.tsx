import { Button, Checkbox, Table, Text } from '@mantine/core';

import type { FormProduct } from 'models/stripe';

interface Props {
  products: FormProduct[];
}

export default function FeaturesForm(props: Props) {
  const { products } = props;

  const doesProdContainsFeature = (prodId: string, feature: string) => {
    const target = products.find((prod) => prod.id)!;
    return target.features.some((feat) => feat === feature);
  };

  const features = products.flatMap((prod) => prod.features);

  const ths = products.map((prod) => (
    <th key={prod.id}>Element position</th>
  ));

  const rows = features.map((feat) => {
    const productsCheck = products.map((prod) => (
      <td key={prod.id}>
        <Checkbox checked={doesProdContainsFeature(prod.id, feat)} />
      </td>
    ));
    return (
      <tr key={feat}>
        <td>{feat}</td>
        {productsCheck}
      </tr>
    )
  });
  return (
    <>
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
            <td>
              <Button variant="outline">Add another</Button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
