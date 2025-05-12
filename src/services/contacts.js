import { Contact } from '../models/contactModel.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  contactType,
  isFavourite,
  userId,
}) => {
  const pageNum = parseInt(page);
  const perPageNum = parseInt(perPage);

  const skip = (pageNum - 1) * perPageNum;

  const filter = { userId };
  if (contactType) filter.contactType = contactType;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const totalItems = await Contact.countDocuments(filter);

  const data = await Contact.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(perPageNum);

  const totalPages = Math.ceil(totalItems / perPageNum);
  const hasPreviousPage = pageNum > 1;
  const hasNextPage = pageNum < totalPages;

  return {
    data,
    page: pageNum,
    perPage: perPageNum,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (id, contactData, userId) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, contactData, {
    new: true,
  });
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};
