import { axiosBase } from "@/lib/axios-instance";
import type { LoginRequestPayload, LoginResponse } from "./types";

/**
 * Send OTP to user's email for MFA authentication.
 * This endpoint sends a verification code to the provided email address.
 */
export const loginApi = async (
  payload: LoginRequestPayload
): Promise<LoginResponse> => {
  const res = await axiosBase.post("/auth/login", payload);
  return res.data;
};

