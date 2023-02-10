import { Schema, model } from 'mongoose';
import type { TOtpDocument } from './otp.interface';

const OtpSchema = new Schema<TOtpDocument>({
  code: {
    type: Number,
    required: [true, 'A six digit code is required'],
    min: [100000, 'minimum value of verification should be 100000'],
    max: [999999, 'maximum value of verification should be 999999'],
  },
  codeExpirationDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const OtpModel = model<TOtpDocument>('OTP', OtpSchema);
export default OtpModel;
