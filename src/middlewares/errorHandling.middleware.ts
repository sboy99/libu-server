import getStructuredZodError from '@/utils/zod.error';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = Number(err?.status ?? 500);
  const message = String(err?.message) ?? `Something went wrong`;

  // console.log(err);
  if (err instanceof ZodError) {
    const structuredError = getStructuredZodError(err);
    return res.status(400).json(structuredError);
  }

  res.status(status).json({ message });
};

export default errorHandler;
