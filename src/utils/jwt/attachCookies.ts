import type {
  AttachCookies,
  GetAccessToken,
  GetRefreshToken,
} from '@/interfaces/app.interface';
import type { Secret } from 'jsonwebtoken';

import { _15MINS, _3DAY } from '@/utils/global';
import jwt from 'jsonwebtoken';

const getAccessToken: GetAccessToken = (payload) => {
  const jwtSecret: Secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, jwtSecret, {
    expiresIn: _15MINS,
  });
};

const getRefreshToken: GetRefreshToken = (payload, refreshToken) => {
  const jwtSecret: Secret = process.env.JWT_SECRET as string;
  return jwt.sign({ ...payload, refreshToken }, jwtSecret, {
    expiresIn: _3DAY,
  });
};

const attachCookies: AttachCookies = (res, payload, refreshToken) => {
  const jwtAccessToken = getAccessToken(payload);
  const jwtRefreshToken = getRefreshToken(payload, refreshToken);

  res.cookie('access_token', jwtAccessToken, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: _15MINS,
  }),
    res.cookie('refresh_token', jwtRefreshToken, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: _3DAY,
    });
};

export default attachCookies;
