import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import type { AnyZodObject } from 'zod';

type Validator = (vSchema: AnyZodObject) => ApiRequestHandler;

export const validateBody: Validator = (vSchema) => async (req, res, next) => {
  const validBody = await vSchema.parseAsync(req.body);
  req.body = validBody;
  next();
};

export const validateParams: Validator =
  (vSchema) => async (req, res, next) => {
    const validParams = await vSchema.parseAsync(req.params);
    for (const key in validParams) {
      req.params[key] = validParams[key] as string;
    }
    next();
  };

export const validateQueries: Validator =
  (vSchema) => async (req, res, next) => {
    const validQuery = await vSchema.parseAsync(req.query);
    req.query = validQuery;
    next();
  };
