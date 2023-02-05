import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const status = Number(err?.status ?? 500);
  const message = String(err?.message) ?? `Something went wrong`;
  res.status(status).json({ message });
};

export default errorHandler;
