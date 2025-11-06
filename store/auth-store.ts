import { create } from "zustand";

interface AuthState {
  email: string | null;
  otp_id: string | null;
  expires_in: number | null;
  setOtpData: (email: string, otp_id: string, expires_in: number) => void;
  clearOtpData: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: null,
  otp_id: null,
  expires_in: null,
  setOtpData: (email, otp_id, expires_in) =>
    set({ email, otp_id, expires_in }),
  clearOtpData: () => set({ email: null, otp_id: null, expires_in: null }),
}));

