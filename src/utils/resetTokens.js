import jwt from 'jsonwebtoken';
import createError from 'http-errors';

export const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
};

export const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    throw createError(401, 'Token is expired or invalid.');
  }
};
