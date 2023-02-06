import type { z } from 'zod';
import type userVSchema from './user.validation';

export type TUser = z.infer<(typeof userVSchema)['create']>;
