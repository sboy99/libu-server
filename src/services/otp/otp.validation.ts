import { z } from 'zod';

const now = new Date();
now.setMinutes(now.getMinutes() + 5);

class OtpVSchema {
  public create = z.object({
    code: z
      .number({
        invalid_type_error: 'only number values are allowed',
        required_error: 'A six digit code is required',
      })
      .min(100000, 'minimum value of verification should be 100000')
      .max(999999, 'maximum value of verification should be 999999'),
    codeExpirationDate: z.date().default(now),
    email: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'email is required',
      })
      .email('Plase provide a vali email'),
  });
}

export default OtpVSchema;
