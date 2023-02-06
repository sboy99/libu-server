import { MONGO_ID, PW_REGX } from '@/utils/global';
import { z } from 'zod';

const create = z.object({
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

  isVerified: z
    .boolean({
      invalid_type_error: `only string values are allowed`,
    })
    .default(false),

  isSuspended: z
    .boolean({
      invalid_type_error: `only string values are allowed`,
    })
    .default(false),

  mobile: z
    .number({
      invalid_type_error: `only number values are allowed`,
    })
    .nullable()
    .default(null),

  avatar: z
    .string({
      invalid_type_error: `only string values are allowed`,
    })
    .nullable()
    .default(null),

  role: z.enum(['reader', 'librarian', 'owner']).default('reader'),

  address: z.array(
    z.object({
      addressId: z
        .string({
          invalid_type_error: `only string values are allowed`,
          required_error: `adress id is required`,
        })
        .regex(MONGO_ID, `please provide a valid adress id`),
    })
  ),

  // Todo:   bookShelf
  // Todo:  faviroutes
  // Todo:  rentedBooks
  //bag
  bag: z
    .string({
      invalid_type_error: `only string values are allowed`,
    })
    .regex(MONGO_ID, `please provide a valid adress id`)
    .nullable()
    .default(null),

  isDeleted: z
    .boolean({
      invalid_type_error: `only string values are allowed`,
    })
    .default(false),
});

const userVSchema = {
  create,
};

export default userVSchema;
