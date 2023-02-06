import { PW_REGX } from '@/utils/global';
import { z } from 'zod';

class AuthVSchema {
  public register = z.object({
    name: z
      .string({
        invalid_type_error: `only string values are allowed`,
        required_error: `name is required`,
      })
      .min(2, `minimum length of name should be 2`)
      .max(50, `maximum length of name should be 50`)
      .trim(),

    email: z
      .string({
        invalid_type_error: `only string values are allowed`,
        required_error: `email is required`,
      })
      .email(`Please provide a valid email address`)
      .trim(),

    password: z
      .string({
        invalid_type_error: `only string values are allowed`,
        required_error: `email is required`,
      })
      .trim()
      .min(6, 'password must be atleast 6 characters long')
      .regex(
        PW_REGX,
        `password should have atleast 1 uppercase, 1 lowercase and 1 number`
      ),
  });

  public login = z.object({
    email: z
      .string({
        invalid_type_error: `only string values are allowed`,
        required_error: `email is required`,
      })
      .email(`Please provide a valid email address`)
      .trim(),

    password: z
      .string({
        invalid_type_error: `only string values are allowed`,
        required_error: `email is required`,
      })
      .trim()
      .min(6, 'password must be atleast 6 characters long')
      .regex(
        PW_REGX,
        `password should have atleast 1 uppercase, 1 lowercase and 1 number`
      ),
  });
}

export default AuthVSchema;
