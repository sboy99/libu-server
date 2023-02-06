import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';

class UserController {
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
