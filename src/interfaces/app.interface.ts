import type IRoute from '@/interfaces/route.interface';
import type { Request, Response } from 'express';
import type { Types } from 'mongoose';

interface JwtPayload {
  userId: string;
  userName: string;
  role: 'reader' | 'librarian' | 'owner';
}

type UserTokenPayload = {
  ip: string;
  refreshToken: string;
  userAgent: string;
  userId: Types.ObjectId;
};

export declare type IReturnsVoid = () => void;
export declare type IInitializeRoutes = (routes: IRoute[]) => void;

export declare type GetAccessToken = (payload: JwtPayload) => string;
export declare type GetRefreshToken = (
  payload: JwtPayload,
  refreshToken: string
) => string;

export declare type AttachCookies = (
  res: Response,
  payload: JwtPayload,
  refreshToken: string
) => void;

export declare type GetUserLoginToken = (
  req: Request,
  userId: Types.ObjectId
) => Promise<UserTokenPayload | never>;
