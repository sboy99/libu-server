import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import type { JwtPayload } from '@/interfaces/app.interface';
import type IResMessage from '@/interfaces/responseMessage.interface';

class UserController {
  /**
   * **Display user data**
   * - Grab the user from req set by authenticaton middleware
   * - Delete refrest token from the payload
   * - Send successfull response to the client
   * @param req express request
   * @param res express response
   */
  public getUser: ApiRequestHandler<
    unknown,
    IResMessage & { user: JwtPayload }
  > = (req, res) => {
    const user = req.user;
    delete user.refreshToken;

    res.status(200).json({
      type: 'success',
      message: 'succesfully authenticated user',
      user,
    });
  };

  // create user
  public create: ApiRequestHandler = (req, res) => {
    res.status(200).json({ message: 'User created' });
  };

  // Read many users
  public readMany: ApiRequestHandler = (req, res) => {
    res.status(200).json({ message: 'User Read All' });
  };

  // Read one user
  public readOneById: ApiRequestHandler = (req, res) => {
    res.status(200).json({ message: 'User Read By Id' });
  };

  // Update one user's details
  public updateOneById: ApiRequestHandler = (req, res) => {
    res.status(200).json({ message: 'User Update By Id' });
  };

  // Delete one user
  public deleteOneById: ApiRequestHandler = (req, res) => {
    res.status(200).json({ message: 'User Delete By Id' });
  };
}

export default UserController;
