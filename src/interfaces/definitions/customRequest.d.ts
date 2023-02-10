import type { JwtUserPayload } from '@/interfaces/app.interface';

declare global {
  namespace Express {
    export interface Request {
      user: JwtUserPayload;
    }
  }
}
