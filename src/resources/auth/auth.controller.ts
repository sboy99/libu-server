import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import type IResMessage from '@/interfaces/responseMessage.interface';
import type {
  TForgotPasswordPayload,
  TLoginPayload,
  TRegisterPayload,
  TResendOtpPayload,
  TRestPasswordPayload,
  TVerifyOtpPayload,
} from './auth.interface';

import UserModel from '@/resources/user/user.model';
import MailService from '@/services/mail.service';
import OtpService from '@/services/otp/otp.service';
import Errors from '@/utils/exceptions/errors';
import attachCookies from '@/utils/jwt/attachCookies';
import createUserPayload from '@/utils/jwt/createUserPayload';
import deleteCookies from '@/utils/jwt/deleteCookies';
import getUserLoginToken from '@/utils/jwt/getUserLoginToken';
import verifyPassword from '@/utils/security/verifyPassword';
import TokenModel from '../token/token.model';

class AuthController {
  private mailService: InstanceType<typeof MailService>;
  private otpService: InstanceType<typeof OtpService>;

  constructor() {
    this.mailService = new MailService();
    this.otpService = new OtpService();
    this.checkMailService();
  }
  /**
   *
   */
  private checkMailService = () => {
    this.mailService
      .verifyConnection()
      .then(() => console.log('Mail service is live'))
      .catch((e: InstanceType<typeof Error>) => {
        console.error(
          `Mail initialization was unsuccessfull\nPossible reason ${e.message}`
        );
      });
  };
  /**
   * **Register a new user locally**
   * - if user data gets successfully validated  then continue
   * - extract the email from payload to check
   * - search if user exists return error if not continue
   * - create a user
   * - Generate a verification otp
   * - send email to verify users's email
   * @param req `express request`
   * @param res `express response`
   */
  public register: ApiRequestHandler<
    TRegisterPayload,
    IResMessage & { email: string }
  > = async (req, res) => {
    const { email } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist)
      throw new Errors.BadRequestError(
        'Another user exists with the same email'
      );
    const user = await UserModel.create(req.body);
    const otp = await this.otpService.generateOtp({ email: user.email });
    await this.mailService.sendVerificationMail({
      name: user.name,
      email: otp.email,
      otp: otp.code,
    });
    res.status(200).json({
      email: otp.email,
      type: 'success',
      message:
        'An verification mail has been sent successfully. Please check your inbox and verify the mail',
    });
  };
  /**
   *  **Log in a existing user**
   * - if user data gets successfully validated  then continue
   * - grab user email and password
   * - search for the user in the DB
   * - if user not exist send not found error
   * - if user exist verify user's current password with rigistered one if fails send error else continue
   * - if user has not verified email send a warning
   * - get user login token
   * - attach access token and refresh token
   * @param req `express request`
   * @param res `express response`
   */
  public login: ApiRequestHandler<TLoginPayload, IResMessage> = async (
    req,
    res
  ) => {
    const { email, password } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (!isUserExist) throw new Errors.NotFoundError('User does not exist');
    const hasApprovedPassword = await verifyPassword(
      password,
      isUserExist.password
    );
    if (!hasApprovedPassword)
      throw new Errors.BadRequestError('Invalid password');
    const resMessage: IResMessage = {
      type: 'success',
      message: 'Login was successful',
    };
    if (!isUserExist.isVerified) {
      resMessage.type = 'warning';
      resMessage.message = 'Please verify your email address';
    }
    const jwtUserPayload = createUserPayload(isUserExist);
    const { refreshToken } = await getUserLoginToken(req, isUserExist._id);
    attachCookies(res, jwtUserPayload, refreshToken);

    res.status(200).json(resMessage);
  };
  /**
   * **Logs out a user on request**
   * - After authentication, grab `userId` from request body
   * - Delete active session from database
   * - Delete all cookies & others from client
   * - Send a successfull response
   * @param req
   * @param res
   */
  public logout: ApiRequestHandler<unknown, IResMessage> = async (req, res) => {
    const { userId } = req.user;
    await TokenModel.deleteMany({ userId });
    deleteCookies(res, ...Object.keys(req.signedCookies as object));
    res.status(200).json({ type: 'success', message: 'User has logged out' });
  };
  /**
   * **Verifies an OTP authenticity**
   * - Calls OTP service that verifies authenticity
   * - throws custom error `Expired` on `Invalid`
   * - returns `Valid` on successfull verification
   * @param otp `number`
   * @param email `string`
   *
   */
  private verifyOtp = async (otp: number, email: string) => {
    const otpStatus = await this.otpService.verifyOtp({ otp, email });

    if (otpStatus === 'Expired')
      throw new Errors.BadRequestError(
        'Otp session expired! Please regengerate an OTP again'
      );
    if (otpStatus === 'Invalid')
      throw new Errors.BadRequestError('Otp is invalid');

    return 'Valid';
  };
  /**
   * **Verify email with OTP**
   *  - Grab `otp` and `email` from request body
   *  - Verify OTP [Call OTP service]
   *  - Send response based on OTP status
   *  - If OTP verification is successfull update user and set `isValid` is true
   *  - Send a response `your email has been verified successfully`
   * @param req `express request`
   * @param res `express response`
   */
  public verifyEmail: ApiRequestHandler<TVerifyOtpPayload, IResMessage> =
    async (req, res) => {
      const { otp, email } = req.body;
      await this.verifyOtp(otp, email);
      await UserModel.findOneAndUpdate({ email }, { isVerified: true });
      res.status(200).json({
        type: 'success',
        message: 'Congratulations!, you email has been verified successfully',
      });
    };
  /**
   * **Forgot password handler**
   * - Grab email from request body
   * - Generate an OTP using that email [use OTP Service]
   * - Also send the code as an email to the client [use Mail Service]
   * - Send a success response to the client also include the email
   * @param req `express request`
   * @param res `express response`
   */
  public forgotPassword: ApiRequestHandler<
    TForgotPasswordPayload,
    IResMessage & { email: string }
  > = async (req, res) => {
    const { email } = req.body;
    const otp = await this.otpService.generateOtp({ email });
    await this.mailService.sendForgotPasswordMail({
      email: otp.email,
      otp: otp.code,
    });
    res.status(200).json({
      email: otp.email,
      type: 'success',
      message: 'successfully sent OTP, Plase check your inbox',
    });
  };
  /**
   * **Resets Password on an user**
   * - Grab `email` & `otp` from request body
   * - Search for user exist or not, if not send a fake sucess response otherwise
   * - verify the OTP
   * - Destrucuture `updatedPassword` from request body
   * - Encrypt the password
   * - Save the password in user collection
   * - Response with a success
   * @param req `express request`
   * @param res `express response`
   */
  public resetPassword: ApiRequestHandler<TRestPasswordPayload, IResMessage> =
    async (req, res) => {
      const { email, otp, updatedPassword } = req.body;
      const isUserExist = await UserModel.findOne({ email });
      if (!isUserExist) {
        return res.status(200).json({
          type: 'success',
          message: 'successfully reset password',
        });
      }
      await this.verifyOtp(otp, email);
      const user = isUserExist;
      user.password = updatedPassword;
      await user.save();
      res.status(200).json({
        type: 'success',
        message: 'successfully reset password',
      });
    };
  /**
   * **Resend OTP to client**
   * - Regengerate OTP [Call OTP service]
   * - Retrive email template from request body
   * - Send an email based on requested template
   * - Send response to the client along with email
   * @param req `express request`
   * @param res `express response`
   */
  public resendOtp: ApiRequestHandler<
    TResendOtpPayload,
    IResMessage & { email: string }
  > = async (req, res) => {
    const { email, template } = req.body;
    const otp = await this.otpService.reGenerateOtp({ email });

    if (template === 'VerifyEmail') {
      await this.mailService.sendVerificationMail({
        email: otp.email,
        otp: otp.code,
        resend: true,
      });
    }
    if (template === 'ForgotPassword') {
      // todo: Send forget password email
    }
    res.status(200).json({
      email: otp.email,
      type: 'success',
      message: 'successfully sent OTP, Plase check your inbox',
    });
  };
}

export default AuthController;
