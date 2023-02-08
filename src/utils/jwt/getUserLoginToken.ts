import type { GetUserLoginToken } from '@/interfaces/app.interface';
import TokenModel from '@/resources/token/token.model';
import crypto from 'crypto';
import Errors from '../exceptions/errors';

const getUserLoginToken: GetUserLoginToken = async (req, userId) => {
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  if (!userAgent)
    throw new Errors.BadRequestError('Please use supported browser');

  const userToken = {
    ip,
    refreshToken: '',
    userAgent,
    userId,
  };
  const isTokenExist = await TokenModel.findOne({
    userId,
  });
  if (isTokenExist) {
    if (isTokenExist.isSuspended)
      throw new Errors.ForbiddenError(
        'You are temporily banned from the server!'
      );
    userToken.refreshToken = isTokenExist.refreshToken;
  } else {
    userToken.refreshToken = crypto.randomBytes(70).toString('hex');
    await TokenModel.create(userToken);
  }

  return userToken;
};

export default getUserLoginToken;
