import { create } from 'zustand';
import type { OnboardingData, PruebasFisicas, AppBloqueo, FotoOnboarding } from '@/types/user.types';

interface OnboardingStore {
  data: OnboardingData;
  currentStep: number;
  setField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
  setPrueba: <K extends keyof PruebasFisicas>(key: K, value: number) => void;
  toggleAdiccion: (id: string) => void;
  addBloqueo: (bloqueo: AppBloqueo) => void;
  removeBloqueo: (appPackage: string) => void;
  addFoto: (foto: FotoOnboarding) => void;
  removeFoto: (tipo: FotoOnboarding['tipo']) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const initialData: OnboardingData = {
  nombre: '',
  edad: 17,
  peso_actual: 0,
  altura: 0,
  peso_objetivo: 0,
  historial_entrenamiento: '',
  meses_inactivo: 0,
  pruebas_fisicas: {
    flexiones_max: 0,
    dominadas_max: 0,
    tiempo_1km_seg: 0,
    plancha_seg: 0,
    sentadillas_max: 0,
  },
  adicciones: [],
  apps_bloquear: [],
  fotos: [],
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  data: { ...initialData },
  currentStep: 0,

  setField: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),

  setPrueba: (key, value) =>
    set((state) => ({
      data: {
        ...state.data,
        pruebas_fisicas: { ...state.data.pruebas_fisicas, [key]: value },
      },
    })),

  toggleAdiccion: (id) =>
    set((state) => {
      const existe = state.data.adicciones.includes(id);
      return {
        data: {
          ...state.data,
          adicciones: existe
            ? state.data.adicciones.filter((a) => a !== id)
            : [...state.data.adicciones, id],
        },
      };
    }),

  addBloqueo: (bloqueo) =>
    set((state) => ({
      data: { ...state.data, apps_bloquear: [...state.data.apps_bloquear, bloqueo] },
    })),

  removeBloqueo: (appPackage) =>
    set((state) => ({
      data: {
        ...state.data,
        apps_bloquear: state.data.apps_bloquear.filter((b) => b.app_package !== appPackage),
      },
    })),

  addFoto: (foto) =>
    set((state) => ({
      data: {
        ...state.data,
        fotos: [...state.data.fotos.filter((f) => f.tipo !== foto.tipo), foto],
      },
    })),

  removeFoto: (tipo) =>
    set((state) => ({
      data: { ...state.data, fotos: state.data.fotos.filter((f) => f.tipo !== tipo) },
    })),

  setStep: (step) => set({ currentStep: step }),

  reset: () => set({ data: { ...initialData }, currentStep: 0 }),
}));
