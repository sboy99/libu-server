/* eslint-disable @typescript-eslint/no-unused-vars */
import type IResMessage from '@/interfaces/responseMessage.interface';
import getStructuredZodError from '@/utils/zod.error';
import type { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler<
  unknown,
  IResMessage & { errors?: Record<string, string> }
> = (err, req, res, next) => {
  let status = Number(err?.status ?? 500);
  let message = String(err?.message) ?? `Something went wrong`;

  // console.log(err);
  if (err instanceof ZodError) {
    const structuredError = getStructuredZodError(err);
    return res.status(400).json({
      type: 'error',
      message: 'input data validation error',
      errors: structuredError,
    });
  }

  // file upload error
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      status = 400;
      message = 'file size exceeds maximum file size';
    }
  }

  res.status(status).json({ type: 'error', message });
};

export default errorHandler;
