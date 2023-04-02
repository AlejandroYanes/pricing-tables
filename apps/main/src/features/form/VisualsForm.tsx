import type { ReactNode } from 'react';
import { CheckIcon, ColorSwatch, Grid, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { RenderIf } from 'ui';

import TwoColumnsLayout from './TwoColumnsLayout';

interface Props {
  showPanel: boolean;
  template: ReactNode;
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
  const { showPanel, template, color, onColorChange } = props;

  const panel = (
    <>
      <div>
        <Text>Pick a color</Text>
        <Grid columns={6} mt="xs">
          {baseColors.map((baseColor) => (
            <Grid.Col span={1} key={baseColor}>
              <Tooltip label={baseColor} position="bottom">
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
              </Tooltip>
            </Grid.Col>
          ))}
        </Grid>
      </div>
    </>
  );

  return (
    <TwoColumnsLayout leftContent={showPanel ? panel : null} rightContent={template} />
  );
}
