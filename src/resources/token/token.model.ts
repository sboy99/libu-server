import { model } from 'mongoose';

import { Schema } from 'mongoose';
import type { TUserTokenDocument } from './token.interface';

const TokenSchema = new Schema<TUserTokenDocument>(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const TokenModel = model<TUserTokenDocument>('Token', TokenSchema);

export default TokenModel;
