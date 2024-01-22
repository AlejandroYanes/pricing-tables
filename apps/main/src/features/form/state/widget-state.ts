import { create } from 'zustand'
import type { WidgetFormState } from '@dealo/models';

export const useWidgetFormStore = create<WidgetFormState>(() => ({
  id: '',
  name: '',
  template: '',
  color: 'emerald',
  products: [],
  features: [],
  callbacks: [],
  recommended: null,
  subscribeLabel: 'Subscribe',
  freeTrialLabel: 'Free Trial',
  usesUnitLabel: false,
  unitLabel: null,
  successUrl: null,
  cancelUrl: null,
}));

export const useFormPageStates = () => useWidgetFormStore(
  (state) => ({
    name: state.name,
    template: state.template,
    productCount: state.products.length,
  }),
  (old, next) => old.template === next.template && old.name === next.name && old.productCount === next.productCount,
);

export const useVisualPanelStates = () => useWidgetFormStore((state) => ({
  color: state.color,
  setColor: (color: string) => useWidgetFormStore.setState({ color }),
}));

export const useSettingsPanelStates = () => useWidgetFormStore((state) => ({
  selectedProducts: state.products,
  callbacks: state.callbacks,
  template: state.template,
  setTemplate: (template: string) => useWidgetFormStore.setState({ template }),
  name: state.name,
  setName: (name: string) => useWidgetFormStore.setState({ name }),
  recommended: state.recommended,
  setRecommended: (recommended: string) => useWidgetFormStore.setState({ recommended }),
  subscribeLabel: state.subscribeLabel,
  setSubscribeLabel: (subscribeLabel: string) => useWidgetFormStore.setState({ subscribeLabel }),
  freeTrialLabel: state.freeTrialLabel,
  setFreeTrialLabel: (freeTrialLabel: string) => useWidgetFormStore.setState({ freeTrialLabel }),
  usesUnitLabel: state.usesUnitLabel,
  unitLabel: state.unitLabel,
  successUrl: state.successUrl,
  setSuccessUrl: (successUrl: string) => useWidgetFormStore.setState({ successUrl }),
  cancelUrl: state.cancelUrl,
  setCancelUrl: (cancelUrl: string) => useWidgetFormStore.setState({ cancelUrl }),
}));

export const useTemplateStates = () => useWidgetFormStore((state) => ({
  template: state.template,
  products: state.products,
  features: state.features,
  callbacks: state.callbacks,
  recommended: state.recommended,
  subscribeLabel: state.subscribeLabel,
  freeTrialLabel: state.freeTrialLabel,
  unitLabel: state.unitLabel,
  color: state.color,
}));
