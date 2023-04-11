import type { ReactNode } from 'react';
import { ActionIcon, Button, Checkbox, Divider, Group, Select, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { IconInfoCircle, IconTrash } from '@tabler/icons';
import type { FormCallback, FormProduct } from 'models';
import { RenderIf } from 'ui';

import TwoColumnsLayout from './TwoColumnsLayout';

interface Props {
  showPanel: boolean;
  template: ReactNode;
  products: FormProduct[];
  name: string;
  recommended: string | null;
  onRecommendedChange: (next: string) => void;
  usesUnitLabel: boolean;
  unitLabel: string | null;
  onNameChange: (nextName: string) => void;
  onToggleUnitLabels: () => void;
  onUnitLabelChange: (nextLabel: string) => void;
  subscribeLabel: string;
  onSubscribeLabelChange: (nextLabel: string) => void;
  freeTrialLabel: string;
  onFreeTrialLabelChange: (nextLabel: string) => void;
  callbacks: FormCallback[];
  onAddNewCallback: () => void;
  onDeleteCallback: (index: number) => void;
  onCallbackEnvChange: (index: number, nextEnv: string) => void;
  onCallbackUrlChange: (index: number, nextUrl: string) => void;
}

const callbackHelp = `
Callbacks are used to send all the information about the plan, price and billing period selected by the user.
The url should be an endpoint of your server that will process this information and redirect the user to a specific page
to continue the checkout process.
`;

export default function SettingsForm(props: Props) {
  const {
    showPanel,
    template,
    products,
    name,
    recommended,
    onRecommendedChange,
    usesUnitLabel,
    unitLabel,
    onNameChange,
    onToggleUnitLabels,
    onUnitLabelChange,
    subscribeLabel,
    onSubscribeLabelChange,
    freeTrialLabel,
    onFreeTrialLabelChange,
    callbacks,
    onAddNewCallback,
    onDeleteCallback,
    onCallbackEnvChange,
    onCallbackUrlChange,
  } = props;

  const options = products.map((prod) => ({ label: prod.name, value: prod.id }));

  const panel = (
    <>
      <TextInput label="Template name" value={name} onChange={(e) => onNameChange(e.target.value)} />
      <Select label="Recommended Product" data={options} value={recommended} onChange={onRecommendedChange} />
      <TextInput label="CTA button label" value={subscribeLabel} onChange={(e) => onSubscribeLabelChange(e.target.value)} />
      <TextInput label="Free trial button label" value={freeTrialLabel} onChange={(e) => onFreeTrialLabelChange(e.target.value)} />
      <Checkbox
        mt="md"
        label="Use unit labels"
        checked={usesUnitLabel}
        onChange={() => undefined}
        onClick={onToggleUnitLabels}
      />
      <RenderIf condition={usesUnitLabel}>
        <TextInput
          mt={-12}
          label="Label"
          value={unitLabel || ''}
          onChange={(e) => onUnitLabelChange(e.target.value)}
        />
      </RenderIf>
      <Divider
        label={
          <Tooltip
            transitionProps={{ duration: 200 }}
            label={callbackHelp}
            width={280}
            position="right"
            multiline
            withArrow
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>Callbacks</span>
              <IconInfoCircle size={14} style={{ marginLeft: '4px' }} />
            </div>
          </Tooltip>
        }
      />
      <Text>

      </Text>
      <Stack>
        {callbacks.map((cb, index) => (
          <Group key={index} spacing={0} align="flex-start">
            <TextInput
              styles={{
                root: {
                  width: '30%',
                },
                input: {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
              label={index === 0 ? 'Env' : ''}
              value={cb.env}
              disabled={index < 2}
              error={!!cb.error}
              onChange={(e) => onCallbackEnvChange(index, e.target.value)}
            />
            <TextInput
              styles={{
                root: {
                  flex: 1,
                },
                label: {
                  marginLeft: '8px',
                },
                input: {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                },
              }}
              rightSection={
                index > 1
                  ? (
                    <ActionIcon onClick={() => onDeleteCallback(index)}>
                      <IconTrash size={14} />
                    </ActionIcon>
                  )
                  : null
              }
              placeholder="https://your.server.com/api/product"
              label={index === 0 ? 'Redirect to' : ''}
              value={cb.url}
              error={!!cb.error}
              onChange={(e) => onCallbackUrlChange(index, e.target.value)}
            />
            <RenderIf condition={!!cb.error}>
              <Text size="sm" color="red">{cb.error}</Text>
            </RenderIf>
          </Group>
        ))}
        <Button mt="xs" ml="auto" onClick={onAddNewCallback}>Add callback</Button>
      </Stack>
    </>
  );

  return (
    <TwoColumnsLayout leftContent={showPanel ? panel : null} rightContent={template} />
  );
}
