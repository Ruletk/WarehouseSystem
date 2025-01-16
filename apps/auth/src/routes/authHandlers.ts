import { Request, Response } from 'express';

class AuthHandlers {
  constructor(private _) {}

  loginHandler = async (req: Request, res: Response) => {
    res.send({ message: 'Login route' });
  };

  registerHandler = async (req: Request, res: Response) => {
    res.send({ message: 'Register route' });
  };

  logoutHandler = async (req: Request, res: Response) => {
    res.send({ message: 'Logout route' });
  };

  resetPasswordHandler = async (req: Request, res: Response) => {
    res.send({ message: 'Reset password route' });
  };

  changePasswordHandler = async (req: Request, res: Response) => {
    const { token } = req.params;
    res.send({ message: `Change password route, token: ${token}` });
  };
}

export { AuthHandlers };
