import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import mongoose from 'mongoose';
import createError from 'http-errors';

export const handleGetAllContacts = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const handleGetContactById = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(404, 'Contact not found');
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const handleCreateContact = async (req, res, next) => {
  const { name, phoneNumber, contactType, email, isFavourite } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      'Missing required fields: name, phoneNumber or contactType',
    );
  }

  const newContact = await createContact({
    name,
    phoneNumber,
    contactType,
    email,
    isFavourite,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const handleUpdateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phoneNumber, contactType, email, isFavourite } = req.body;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(404, 'Contact not found');
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
  if (contactType !== undefined) updateData.contactType = contactType;
  if (email !== undefined) updateData.email = email;
  if (isFavourite !== undefined) updateData.isFavourite = isFavourite;

  if (Object.keys(updateData).length === 0) {
    throw createError(400, 'At least one field must be provided for update');
  }

  const updatedContact = await updateContact(contactId, updateData);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const handleDeleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(404, 'Contact not found');
  }

  const result = await deleteContact(contactId);

  if (!result) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
