import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { RenderIf } from '@dealo/ui';
import { templatesList } from '@dealo/templates';

import { trpc } from 'utils/trpc';
import InputWithLabel from '../../components/ui/input-with-label';
import TwoColumnsLayout from './TwoColumnsLayout';
import { toggleUnitLabel, changeUnitLabel, addNewCallback, deleteCallback, changeCallbackEnv, changeCallbackUrl } from './state/actions';
import { useSettingsPanelStates } from './state';
import SelectWithOptions from '../../components/ui/select-with-options';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Separator } from '../../components/ui/separator';
import { Button } from '../../components/ui/button';

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
      <div className="flex flex-col gap-4">
        <InputWithLabel label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <SelectWithOptions label="Template" options={templateOptions} value={templateId || ''} onValueChange={setTemplate} />
        <SelectWithOptions label="Recommended Product" options={productOptions} value={recommended || ''} onValueChange={setRecommended} />
        <InputWithLabel label="CTA button label" value={subscribeLabel} onChange={(e) => setSubscribeLabel(e.target.value)} />
        <InputWithLabel label="Free trial button label" value={freeTrialLabel} onChange={(e) => setFreeTrialLabel(e.target.value)} />
        <div className="flex items-center gap-4 mt-3">
          <Checkbox
            id="use-unit-label"
            checked={usesUnitLabel}
            onChange={() => undefined}
            onClick={toggleUnitLabel}
          />
          <Label htmlFor="use-unit-label" className="cursor-pointer">Use unit labels</Label>
        </div>
        <RenderIf condition={usesUnitLabel}>
          <InputWithLabel
            className="mt-[-12px]"
            label="Label"
            value={unitLabel || ''}
            onChange={(e) => changeUnitLabel(e.target.value)}
          />
        </RenderIf>
      </div>

      <div className="flex items-center mt-6">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center mr-2">
                  <span>Callbacks</span>
                  <IconInfoCircle size={14} style={{ marginLeft: '4px' }} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-lg" side="right">{callbackHelp}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator orientation="horizontal" />
      </div>
      <div className="flex flex-col mt-4">
        {callbacks.map((cb, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-end">
              <InputWithLabel
                className="w-[120px]"
                inputClassName="rounded-r-none border-r-0"
                label={index === 0 ? 'Env' : ''}
                value={cb.env}
                disabled={index < 2}
                error={!!cb.error}
                onChange={(e) => changeCallbackEnv(index, e.target.value)}
              />
              <InputWithLabel
                className="flex-1"
                inputClassName={index > 1 ? 'rounded-none border-r-0' : 'rounded-l-none'}
                placeholder="https://your.server.com/api/product"
                label={index === 0 ? 'Redirect to' : ''}
                value={cb.url}
                error={!!cb.error}
                onChange={(e) => changeCallbackUrl(index, e.target.value)}
              />
              <RenderIf condition={index > 1}>
                <Button className="rounded-l-none px-2" variant="outline" onClick={() => deleteCallback(index)}>
                  <IconTrash size={14} />
                </Button>
              </RenderIf>
            </div>
            <RenderIf condition={!!cb.error}>
              <span className="text-xs text-destructive">{cb.error}</span>
            </RenderIf>
          </div>
        ))}
        <Button className="mt-4 ml-auto" variant="black" onClick={addNewCallback}>Add callback</Button>

        <div className="flex items-center mt-6 mb-4">
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center mr-2">
                    <span>Checkout</span>
                    <IconInfoCircle size={14} style={{ marginLeft: '4px' }} />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-lg" side="right">{checkoutHelp}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator orientation="horizontal" />
        </div>
        <div className="flex flex-col gap-4">
          <InputWithLabel label="Success URL" value={successUrl || ''} onChange={(e) => setSuccessUrl(e.target.value)} />
          <InputWithLabel label="Cancel URL" value={cancelUrl || ''} onChange={(e) => setCancelUrl(e.target.value)} />
        </div>

        <div className="flex items-center mt-6 mb-4">
          <span className="text mr-2">Danger zone</span>
          <Separator orientation="horizontal" />
        </div>
        <Button variant="destructive-outline" className="w-full" onClick={handleDelete}>
          Delete widget
        </Button>
      </div>
    </>
  );

  return (
    <TwoColumnsLayout leftContent={showPanel ? panel : null} rightContent={template} />
  );
}
