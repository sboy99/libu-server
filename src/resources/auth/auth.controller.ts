import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';

class AuthController {
  // Register a new user
  public register: ApiRequestHandler = (req, res) => {
    res.status(200).json({ message: 'User Register' });
  };

  // Log in a existing user
  public login: ApiRequestHandler = (req, res) => {
    res.status(200).json({ message: 'User logged in' });
  };

  // Log out a user
  public logout: ApiRequestHandler = (req, res) => {
    res.status(200).json({ message: 'User logged out' });
  };
}

export default AuthController;
