import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ActionIcon, Button, Checkbox, Divider, Group, Select, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { RenderIf } from '@dealo/ui';
import { templatesList } from '@dealo/templates';

import { trpc } from 'utils/trpc';
import TwoColumnsLayout from './TwoColumnsLayout';
import { toggleUnitLabel, changeUnitLabel, addNewCallback, deleteCallback, changeCallbackEnv, changeCallbackUrl } from './state/actions';
import { useSettingsPanelStates } from './state';

interface Props {
  widgetId: string;
  showPanel: boolean;
  template: ReactNode;
}

const callbackHelp = `
Callbacks are used to construct the URL that the CTA (Call To Action) button will redirect to.
We add params like widget_id, product_id, price_id and currency to the URL
so that you and we can identify the elements. This can be useful if you want to insert your sign up flow before collecting the payment.
`;

const checkoutHelp = `
These URLs are used to redirect the user after the payment is completed or canceled.
If you leave them empty, we will use the referer URL from the request and add a payment_status query (eg: ?payment_status=success).
As a last resource, we will use our own fallback pages.
`;

export default function SettingsForm(props: Props) {
  const {
    showPanel,
    widgetId,
    template,
  } = props;
  const {
    selectedProducts,
    callbacks,
    name,
    setName,
    recommended,
    setRecommended,
    template: templateId,
    setTemplate,
    unitLabel,
    usesUnitLabel,
    subscribeLabel,
    setSubscribeLabel,
    freeTrialLabel,
    setFreeTrialLabel,
    successUrl,
    setSuccessUrl,
    cancelUrl,
    setCancelUrl,
  } = useSettingsPanelStates();

  const router = useRouter();

  const { mutate: deleteWidget } = trpc.widgets.deleteWidget.useMutation({
    onSuccess: () => router.push('/dashboard'),
    onError: () => showNotification({ title: 'Error', message: 'Something went wrong', color: 'red' }),
  });

  const handleDelete = () => {
    openConfirmModal({
      centered: true,
      title: 'Just to confirm',
      children: 'Are you sure you want to delete this widget? This action cannot be undone.',
      labels: { confirm: 'Delete', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteWidget(widgetId)
    });
  };

  const templateOptions = templatesList.map((temp) => ({ label: temp.name, value: temp.id }));
  const productOptions = selectedProducts.map((prod) => ({ label: prod.name, value: prod.id }));

  const panel = (
    <>
      <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Select label="Template" data={templateOptions} value={templateId} onChange={setTemplate} />
      <Select label="Recommended Product" data={productOptions} value={recommended} onChange={setRecommended} />
      <TextInput label="CTA button label" value={subscribeLabel} onChange={(e) => setSubscribeLabel(e.target.value)} />
      <TextInput label="Free trial button label" value={freeTrialLabel} onChange={(e) => setFreeTrialLabel(e.target.value)} />
      <Checkbox
        mt="md"
        label="Use unit labels"
        checked={usesUnitLabel}
        onChange={() => undefined}
        onClick={toggleUnitLabel}
      />
      <RenderIf condition={usesUnitLabel}>
        <TextInput
          mt={-12}
          label="Label"
          value={unitLabel || ''}
          onChange={(e) => changeUnitLabel(e.target.value)}
        />
      </RenderIf>
      <Divider
        mt="xl"
        label={
          <Tooltip
            transitionProps={{ duration: 200 }}
            label={callbackHelp}
            width={360}
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
              onChange={(e) => changeCallbackEnv(index, e.target.value)}
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
                    <ActionIcon onClick={() => deleteCallback(index)}>
                      <IconTrash size={14} />
                    </ActionIcon>
                  )
                  : null
              }
              placeholder="https://your.server.com/api/product"
              label={index === 0 ? 'Redirect to' : ''}
              value={cb.url}
              error={!!cb.error}
              onChange={(e) => changeCallbackUrl(index, e.target.value)}
            />
            <RenderIf condition={!!cb.error}>
              <Text size="sm" color="red">{cb.error}</Text>
            </RenderIf>
          </Group>
        ))}
        <Button mt="xs" ml="auto" onClick={addNewCallback}>Add callback</Button>

        <Divider
          mt="xl"
          label={
            <Tooltip
              transitionProps={{ duration: 200 }}
              label={checkoutHelp}
              width={340}
              position="right"
              multiline
              withArrow
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>Checkout</span>
                <IconInfoCircle size={14} style={{ marginLeft: '4px' }} />
              </div>
            </Tooltip>
          }
        />
        <TextInput label="Success URL" value={successUrl || ''} onChange={(e) => setSuccessUrl(e.target.value)} />
        <TextInput label="Cancel URL" value={cancelUrl || ''} onChange={(e) => setCancelUrl(e.target.value)} />

        <Divider mt="xl" label="Danger zone" />
        <Button color="red" variant="outline" fullWidth onClick={handleDelete}>
          Delete widget
        </Button>
      </Stack>
    </>
  );

  return (
    <TwoColumnsLayout leftContent={showPanel ? panel : null} rightContent={template} />
  );
}
