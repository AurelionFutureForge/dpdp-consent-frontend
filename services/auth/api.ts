import { axiosBase } from "@/lib/axios-instance";
import type {
  LoginRequestPayload,
  LoginResponse,
  DataFiduciaryRegisterPayload,
  DataFiduciaryRegisterResponse
} from "./types";

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

/**
 * Register a new Data Fiduciary.
 * This endpoint creates a new data fiduciary organization.
 */
export const registerDataFiduciaryApi = async (
  payload: DataFiduciaryRegisterPayload
): Promise<DataFiduciaryRegisterResponse> => {
  const res = await axiosBase.post("/data-fiduciary/register", payload);
  return res.data;
};
