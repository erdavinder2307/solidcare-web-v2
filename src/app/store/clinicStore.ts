import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Clinic {
  id: string;
  name: string;
  code: string;
  city: string | null;
}

interface ClinicState {
  activeClinicId: string | null;
  activeClinic: Clinic | null;
  clinics: Clinic[];
  setActiveClinic: (clinic: Clinic) => void;
  setClinics: (clinics: Clinic[]) => void;
  clearClinic: () => void;
}

export const useClinicStore = create<ClinicState>()(
  persist(
    (set) => ({
      activeClinicId: null,
      activeClinic: null,
      clinics: [],
      setActiveClinic: (clinic) => set({ activeClinic: clinic, activeClinicId: clinic.id }),
      setClinics: (clinics) => set({ clinics }),
      clearClinic: () => set({ activeClinic: null, activeClinicId: null }),
    }),
    {
      name: "solidcare-clinic",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
