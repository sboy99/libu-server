/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { JwtUserPayload } from '@/interfaces/app.interface';
import jwt from 'jsonwebtoken';

const verifyJwtToken = (token: string): JwtUserPayload => {
  const jwtPayload = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtUserPayload;

  return jwtPayload;
};

export default verifyJwtToken;
