import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import TokenVSchema from './token.validation';

const tokenVSchema = new TokenVSchema();
export type TUserTokenDocument = z.infer<(typeof tokenVSchema)['create']> &
  Document<Types.ObjectId>;
