import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendPasswordResetEmail,
  resetPassword,
} from '../services/auth.js';

export const handleRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  const userData = await registerUser({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: userData,
  });
};

export const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await loginUser({ email, password });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

export const handleRefresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  const tokens = await refreshSession(refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: tokens.accessToken },
  });
};

export const handleLogout = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  await logoutUser(refreshToken);

  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const handleSendResetEmail = async (req, res, next) => {
  const { email } = req.body;

  await sendPasswordResetEmail(email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const handleResetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  await resetPassword(token, password);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
