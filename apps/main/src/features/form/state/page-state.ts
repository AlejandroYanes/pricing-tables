import { create } from 'zustand';

type PageFormState = {
  isLoaded: boolean;
  currentTab: string;
  showPanel: boolean;
}

export const usePageFormStore = create<PageFormState>(() => ({
  isLoaded: false,
  currentTab: 'products',
  showPanel: false,
}));
