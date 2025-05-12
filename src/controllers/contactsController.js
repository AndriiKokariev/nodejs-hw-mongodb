import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createError from 'http-errors';

export const handleGetAllContacts = async (req, res, next) => {
  const { page, perPage, sortBy, sortOrder, contactType, isFavourite } =
    req.query;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    contactType,
    isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const handleGetContactById = async (req, res, next) => {
  const { contactId } = req.params;
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
  const updatedContact = await updateContact(contactId, req.body);

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
  const result = await deleteContact(contactId);

  if (!result) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
