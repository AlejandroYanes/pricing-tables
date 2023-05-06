import { create } from 'zustand'
import type { FormCallback, FormFeature, FormProduct } from 'models';

type WidgetFormState = {
  selectedProducts: FormProduct[];
  features: FormFeature[];
  callbacks: FormCallback[];
  id: string | null;
  name: string;
  template: string | null;
  color: string;
  recommended: string | null;
  subscribeLabel: string;
  freeTrialLabel: string;
  usesUnitLabel: boolean;
  unitLabel: string | null;
  successUrl: string | null;
  cancelUrl: string | null;
}

export const useWidgetFormStore = create<WidgetFormState>(() => ({
  selectedProducts: [],
  features: [],
  callbacks: [],
  id: null,
  name: '',
  color: 'teal',
  template: null,
  recommended: null,
  subscribeLabel: 'Subscribe',
  freeTrialLabel: 'Free Trial',
  usesUnitLabel: false,
  unitLabel: null,
  successUrl: null,
  cancelUrl: null,
}));

export const usePageStates = () => useWidgetFormStore((state) => ({
  selectedProducts: state.selectedProducts,
  features: state.features,
  callbacks: state.callbacks,
  template: state.template,
  color: state.color,
  name: state.name,
  recommended: state.recommended,
  subscribeLabel: state.subscribeLabel,
  freeTrialLabel: state.freeTrialLabel,
  usesUnitLabel: state.usesUnitLabel,
  unitLabel: state.unitLabel,
}));

export const useVisualPanelStates = () => useWidgetFormStore((state) => ({
  color: state.color,
  setColor: (color: string) => useWidgetFormStore.setState({ color }),
}));

export const useSettingsPanelStates = () => useWidgetFormStore((state) => ({
  selectedProducts: state.selectedProducts,
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
