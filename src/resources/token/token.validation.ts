import { Schema } from 'mongoose';
import { z } from 'zod';

class TokenVSchema {
  public create = z.object({
    refreshToken: z.string({
      invalid_type_error: 'only string types are supported',
      required_error: 'refresh token is required',
    }),
    ip: z.string({
      invalid_type_error: 'only string types are supported',
      required_error: 'ip address is required',
    }),
    userAgent: z.string({
      invalid_type_error: 'only string types are supported',
      required_error: 'user agent is required',
    }),
    isSuspended: z.boolean().default(false),
    userId: z.instanceof(Schema.Types.ObjectId),
  });
}

export default TokenVSchema;
