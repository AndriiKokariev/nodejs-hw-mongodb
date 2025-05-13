import express from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleCreateContact,
  handleUpdateContact,
  handleDeleteContact,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactSchemas.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import { upload } from '../services/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(handleGetAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(handleCreateContact),
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(handleUpdateContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact));

export default router;
