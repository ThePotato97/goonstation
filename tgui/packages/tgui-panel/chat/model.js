/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

<<<<<<< HEAD
import { MESSAGE_TYPES } from './constants';
import { createUuid } from 'common/uuid';

export const canPageAcceptType = (page, type) => (
  type.startsWith('internal') || page.acceptedTypes[type]
=======
import { createUuid } from 'common/uuid';
import { MESSAGE_TYPES, MESSAGE_TYPE_INTERNAL } from './constants';

export const canPageAcceptType = (page, type) => (
  type.startsWith(MESSAGE_TYPE_INTERNAL) || page.acceptedTypes[type]
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
);

export const createPage = obj => ({
  id: createUuid(),
  name: 'New Tab',
  acceptedTypes: {},
<<<<<<< HEAD
  count: 0,
=======
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
  unreadCount: 0,
  createdAt: Date.now(),
  ...obj,
});

export const createMainPage = () => {
  const acceptedTypes = {};
  for (let typeDef of MESSAGE_TYPES) {
    acceptedTypes[typeDef.type] = true;
  }
  return createPage({
    name: 'Main',
    acceptedTypes,
  });
};

export const createMessage = payload => ({
  createdAt: Date.now(),
  ...payload,
});

export const serializeMessage = message => ({
  type: message.type,
  text: message.text,
<<<<<<< HEAD
  times: message.times,
  createdAt: message.createdAt,
});
=======
  html: message.html,
  times: message.times,
  createdAt: message.createdAt,
});

export const isSameMessage = (a, b) => (
  typeof a.text === 'string' && a.text === b.text
  || typeof a.html === 'string' && a.html === b.html
);
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
