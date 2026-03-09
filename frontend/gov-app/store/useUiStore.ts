import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  selectedCity: 'Chennai',
  setSelectedCity: (city) => set({ selectedCity: city }),
}));
