import mongoose from 'mongoose';
import createError from 'http-errors';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    next(createError(404, 'Invalid ID format'));
    return;
  }

  next();
};

export default isValidId;
