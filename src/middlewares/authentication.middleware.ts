/* eslint-disable @typescript-eslint/no-misused-promises */
import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import TokenModel from '@/resources/token/token.model';
import type { TUserDocument } from '@/resources/user/user.interface';
import Errors from '@/utils/exceptions/errors';
import attachCookies from '@/utils/jwt/attachCookies';
import verifyJwtToken from '@/utils/jwt/verifyJwtToken';
/**
 * **Authentication middleware for user authenticity**
 * - Extract `access-token` & `refresh-token` frpm signed cookies
 * - Send an `unauthorized` response if no token is present
 * - If access token is present verify it through jwt verify and attach jwt payload to request otherwise
 * - Means refresh token is present, verify the refresh token and serch for active session in DB.
 * - If no active session is found or user is blocked send unauthorized response else
 * - Attach access token and response token to response with new expriry date
 * - If any error happens handle then and send `unauthorized` response
 * @param req express request
 * @param res expree response
 * @param next express next function
 */
const authenticate: ApiRequestHandler = async (req, res, next) => {
  const hasAccessToken = req.signedCookies['access_token'] as string;
  const hasRefreshToken = req.signedCookies['refresh_token'] as string;
  if (!hasAccessToken && !hasRefreshToken)
    throw new Errors.UnauthorizedError('Session expired! Please re-login');
  try {
    if (hasAccessToken) {
      const jwtUser = verifyJwtToken(hasAccessToken);
      req.user = jwtUser;
      return next();
    }
    const { refreshToken, ...jwtUser } = verifyJwtToken(hasRefreshToken);
    const isActiveUser = await TokenModel.findOne({
      userId: jwtUser.userId,
      refreshToken,
    });
    if (isActiveUser && !isActiveUser.isSuspended) {
      attachCookies(res, jwtUser, refreshToken as string);
      req.user = jwtUser;
      return next();
    }
    throw new Errors.UnauthorizedError('Authentication failed!');
  } catch (e) {
    throw new Errors.UnauthorizedError('Authentication failed!');
  }
};

export default authenticate;

export const hasPermission =
  (...role: TUserDocument['role'][]): ApiRequestHandler =>
  (req, res, next) => {
    if (!role.includes(req.user.role))
      throw new Errors.ForbiddenError('Access Denied');
    next();
  };
