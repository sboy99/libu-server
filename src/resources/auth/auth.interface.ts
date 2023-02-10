import type { z } from 'zod';
import AuthVSchema from './auth.validation';

const authVSchema = new AuthVSchema();

export type TRegisterPayload = z.infer<(typeof authVSchema)['register']>;
export type TLoginPayload = z.infer<(typeof authVSchema)['login']>;
export type TVerifyOtpPayload = z.infer<(typeof authVSchema)['verifyOtp']>;
export type TResendOtpPayload = z.infer<(typeof authVSchema)['resendOtp']>;
export type TForgotPasswordPayload = z.infer<
  (typeof authVSchema)['forgotPassword']
>;
export type TRestPasswordPayload = z.infer<
  (typeof authVSchema)['resetPassword']
>;
