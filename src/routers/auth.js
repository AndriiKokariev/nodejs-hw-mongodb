import express from 'express';
import {
  handleRegister,
  handleLogin,
  handleRefresh,
  handleLogout,
  handleSendResetEmail,
  handleResetPassword,
} from '../controllers/authController.js';
import validateBody from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../schemas/authSchemas.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(handleRegister),
);
router.post('/login', validateBody(loginSchema), ctrlWrapper(handleLogin));
router.post('/refresh', ctrlWrapper(handleRefresh));
router.post('/logout', ctrlWrapper(handleLogout));

router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(handleSendResetEmail),
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(handleResetPassword),
);

export default router;
