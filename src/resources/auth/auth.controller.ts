import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import type IResMessage from '@/interfaces/responseMessage.interface';
import type { TLoginPayload, TRegisterPayload } from './auth.interface';

import UserModel from '@/resources/user/user.model';
import Errors from '@/utils/exceptions/errors';
import verifyPassword from '@/utils/security/verifyPassword';

class AuthController {
  //> Register a new user locally
  public register: ApiRequestHandler<TRegisterPayload> = async (req, res) => {
    // if user data gets successfully validated  then continue
    // extract the email from payload to check
    const { email } = req.body;
    // search if user exists return error if not continue
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist)
      throw new Errors.BadRequestError(
        'Another user exists with the same email'
      );
    // create a user
    const user = await UserModel.create(req.body);
    // todo: send response to verify users's email
    res.status(200).json(user);
  };

  //> Log in a existing user
  public login: ApiRequestHandler<TLoginPayload, IResMessage> = async (
    req,
    res
  ) => {
    // if user data gets successfully validated  then continue
    // grab user email and password
    const { email, password } = req.body;
    // search for the user in the DB
    const isUserExist = await UserModel.findOne({ email });
    // if user not exist send not found error
    if (!isUserExist) throw new Errors.NotFoundError('User does not exist');
    // if user exist verify user's current password with rigistered one if fails send error else continue
    const hasApprovedPassword = await verifyPassword(
      password,
      isUserExist.password
    );
    if (!hasApprovedPassword)
      throw new Errors.BadRequestError('Invalid password');
    // if user has not verified email send a warning
    const resMessage: IResMessage = {
      type: 'success',
      message: 'Login was successful',
    };
    if (!isUserExist.isVerified) {
      resMessage.type = 'warning';
      resMessage.message = 'Please verify your email address';
    }
    // todo: attach access token and refresh token
    res.status(200).json(resMessage);
  };

  //> Log out a user
  public logout: ApiRequestHandler = (req, res) => {
    res.status(200).json({ message: 'User logged out' });
  };
}

export default AuthController;
