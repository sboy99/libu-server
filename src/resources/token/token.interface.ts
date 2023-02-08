import type { z } from 'zod';
import TokenVSchema from './token.validation';

const tokenVSchema = new TokenVSchema();
export type TUserToken = z.infer<(typeof tokenVSchema)['create']>;
