import { CheckIcon, ColorSwatch, Grid, Select, Text, useMantineTheme } from '@mantine/core';

import type { FormProduct } from 'models/stripe';
import RenderIf from 'components/RenderIf';

interface Props {
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
  const { color, onColorChange } = props;

  return (
    <>
      <Text mb="xl">Visuals</Text>
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
