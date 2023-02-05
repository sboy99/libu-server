import type { Request, RequestHandler, Response } from 'express';

const routeNotFoundHandler: RequestHandler = (req: Request, res: Response) => {
  res.json({
    message: 'Route not found',
  });
};

export default routeNotFoundHandler;
