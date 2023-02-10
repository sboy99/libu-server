import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import UserVSchema from './user.validation';

const userVSchema = new UserVSchema();

export type TUserDocument = z.infer<(typeof userVSchema)['create']> &
  Document<Types.ObjectId>;
