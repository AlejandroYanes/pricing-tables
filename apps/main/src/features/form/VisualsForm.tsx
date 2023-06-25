import type { ReactNode } from 'react';
import { CheckIcon, ColorSwatch, Grid, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { RenderIf } from '@dealo/ui';

import TwoColumnsLayout from './TwoColumnsLayout';
import { useVisualPanelStates } from './state';

interface Props {
  showPanel: boolean;
  template: ReactNode;
}

const baseColors = [
  'violet',
  'grape',
  'indigo',
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
  const { showPanel, template } = props;
  const { color, setColor } = useVisualPanelStates();

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
                  onClick={() => setColor(baseColor)}
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
