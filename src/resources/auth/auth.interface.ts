import type { z } from 'zod';
import AuthVSchema from './auth.validation';

const authVSchema = new AuthVSchema();

export type TRegisterPayload = z.infer<(typeof authVSchema)['register']>;
export type TLoginPayload = z.infer<(typeof authVSchema)['login']>;
