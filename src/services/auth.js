import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';
import createError from 'http-errors';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const createSession = () => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const registerUser = async (userData) => {
  const { email, password, name } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const userWithoutPassword = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };

  return userWithoutPassword;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Email or password is incorrect');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError(401, 'Email or password is incorrect');
  }

  await Session.deleteMany({ userId: user._id });

  const sessionData = createSession();

  const session = await Session.create({
    userId: user._id,
    ...sessionData,
  });

  return {
    accessToken: sessionData.accessToken,
    refreshToken: sessionData.refreshToken,
    sessionId: session._id,
  };
};

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(401, 'Refresh token not found');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const newSessionData = createSession();

  const newSession = await Session.create({
    userId: session.userId,
    ...newSessionData,
  });

  return {
    accessToken: newSessionData.accessToken,
    refreshToken: newSessionData.refreshToken,
    sessionId: newSession._id,
  };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(401, 'Refresh token not found');
  }

  const result = await Session.deleteOne({ refreshToken });

  if (result.deletedCount === 0) {
    throw createError(401, 'Session not found');
  }

  return true;
};

export const validateAccessToken = async (accessToken) => {
  if (!accessToken) {
    throw createError(401, 'Access token not found');
  }

  const session = await Session.findOne({ accessToken });
  if (!session) {
    throw createError(401, 'Invalid access token');
  }

  if (new Date() > session.accessTokenValidUntil) {
    throw createError(401, 'Access token expired');
  }

  const user = await User.findById(session.userId);
  if (!user) {
    throw createError(401, 'User not found');
  }

  return user;
};
