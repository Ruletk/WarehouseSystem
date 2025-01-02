import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', (req, res) => {
  res.send({ message: 'Login route' });
});

authRouter.post('/register', (req, res) => {
  res.send({ message: 'Register route' });
});

authRouter.get('/logout', (req, res) => {
  res.send({ message: 'Logout route' });
});

authRouter.post('/reset-password', (req, res) => {
  res.send({ message: 'Reset password route' });
});

authRouter.post('/change-password/:token', (req, res) => {
  const { token } = req.params;
  res.send({ message: `Change password route, token: ${token}` });
});

export { authRouter };
