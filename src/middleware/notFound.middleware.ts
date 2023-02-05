import type { NextFunction, Request, Response } from 'express';

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  console.log('route not found');
  next();
};

export default routeNotFound;
