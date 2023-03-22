import { CheckIcon, ColorSwatch, Grid, Select, Text, useMantineTheme } from '@mantine/core';

import type { FormProduct } from 'models/stripe';
import RenderIf from 'components/RenderIf';

interface Props {
  products: FormProduct[];
  recommended: string | undefined;
  onRecommendedChange: (next: string) => void;
  color: string;
  onColorChange: (next: string) => void;
}

const baseColors = [
  'violet',
  'indigo',
  'grape',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
  'red',
  'pink',
]

export default function VisualsForm(props: Props) {
  const { colors } = useMantineTheme();
  const { products, recommended, onRecommendedChange, color, onColorChange } = props;

  const options = products.map((prod) => ({ label: prod.name, value: prod.id }));

  // if (options.length === 0) {
  //   return (
  //     <>
  //       <Text mb="xl">Visuals</Text>
  //       <Text>Please add some products first</Text>
  //     </>
  //   );
  // }

  return (
    <>
      <Text mb="xl">Visuals</Text>
      <Select label="Recommended Product" data={options} value={recommended} onChange={onRecommendedChange} />
      <div>
        <Text>Pick a color</Text>
        <Grid columns={6} mt="xs">
          {baseColors.map((baseColor) => (
            <Grid.Col span={1} key={baseColor}>
              <ColorSwatch
                size={36}
                component="button"
                color={colors[baseColor]![5]}
                onClick={() => onColorChange(baseColor)}
                sx={{ color: '#fff', cursor: 'pointer' }}
              >
                <RenderIf condition={baseColor === color}>
                  <CheckIcon width={12} />
                </RenderIf>
              </ColorSwatch>
            </Grid.Col>
          ))}
        </Grid>
      </div>
    </>
  );
}
