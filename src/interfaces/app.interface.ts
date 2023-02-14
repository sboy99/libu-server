import type IRoute from '@/interfaces/route.interface';
import type { TUserDocument } from '@/resources/user/user.interface';
import type { Request, Response } from 'express';
import type { Types } from 'mongoose';

export type Templates = 'emailVerification';

export interface IStringKeyedObject {
  [key: string]: unknown;
}

interface JwtPayload {
  userId: string;
  userName: string;
  role: 'reader' | 'librarian' | 'owner';
}

export interface JwtUserPayload extends JwtPayload {
  refreshToken?: string;
}

interface UserTokenPayload {
  ip: string;
  refreshToken: string;
  userAgent: string;
  userId: Types.ObjectId;
}

interface OTPConsumer {
  name?: string;
  otp: number;
  email: string;
  serviceEmail?: string;
  resend?: boolean;
}

type HtmlTemplteProp = Omit<OTPConsumer, 'email'>;

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

export declare type CreateUserPayload = (
  user: TUserDocument,
  refreshToken?: string
) => JwtUserPayload;

export declare type MailSender = (consumer: OTPConsumer) => Promise<void>;

export declare type UseHtmlTemplte = (prop: HtmlTemplteProp) => string;
