import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import type { AnyZodObject } from 'zod';

type Validator = (vSchema: AnyZodObject) => ApiRequestHandler;

export const validateBody: Validator = (vSchema) => async (req, res, next) => {
  const validData = await vSchema.parseAsync(req.body);
  req.body = validData;
  next();
};

export const validateParams: Validator =
  (vSchema) => async (req, res, next) => {
    const validData = await vSchema.parseAsync(req.params);
    req.params = validData;
    next();
  };
