import type { Model } from 'mongoose';
import { model } from 'mongoose';

import { Schema } from 'mongoose';
import type { TUserToken } from './token.interface';

type TModel = Model<TUserToken>;

const TokenSchema = new Schema<TUserToken, TModel>(
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

const TokenModel = model<TUserToken, TModel>('Token', TokenSchema);

export default TokenModel;
