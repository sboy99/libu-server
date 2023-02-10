import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import OtpVSchema from './otp.validation';

const otpVSchema = new OtpVSchema();

interface GenerateOtpParams {
  email: TOtpDocument['email'];
}

interface VerifyOtpParam extends GenerateOtpParams {
  otp: TOtpDocument['code'];
}

export type TOtpDocument = z.infer<(typeof otpVSchema)['create']> &
  Document<Types.ObjectId>;

export declare type GenerateOtp = (payload: GenerateOtpParams) => Promise<{
  code: number;
  email: string;
}>;

export declare type VerifyOtp = (
  payload: VerifyOtpParam
) => Promise<'Valid' | 'Invalid' | 'Expired'>;
