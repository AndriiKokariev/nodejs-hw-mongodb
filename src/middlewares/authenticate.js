import createError from 'http-errors';
import { validateAccessToken } from '../services/auth.js';

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createError(401, 'Not authorized');
    }

    try {
      const user = await validateAccessToken(token);

      req.user = user;
      next();
    } catch (error) {
      if (error.message === 'Access token expired') {
        throw createError(401, 'Access token expired');
      }
      throw createError(401, 'Not authorized');
    }
  } catch (error) {
    next(error);
  }
};

export default authenticate;
