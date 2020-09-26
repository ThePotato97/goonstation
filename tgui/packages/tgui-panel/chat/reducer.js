/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { addChatPage, changeChatPage, loadChat, removeChatPage, toggleAcceptedType, updateChatPage, updateMessageCount, changeScrollTracking } from './actions';
import { canPageAcceptType, createMainPage } from './model';

const mainPage = createMainPage();

export const initialState = {
<<<<<<< HEAD
  version: 4,
  currentPage: mainPage.id,
=======
  version: 5,
  currentPageId: mainPage.id,
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
  scrollTracking: true,
  pages: [
    mainPage.id,
  ],
  pageById: {
    [mainPage.id]: mainPage,
  },
};

export const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === loadChat.type) {
    // Validate version and/or migrate state
    if (payload?.version !== state.version) {
      return state;
    }
    // Reset page message counts
    // NOTE: We are mutably changing the payload on the assumption
    // that it is a copy that comes straight from the web storage.
    for (let id of Object.keys(payload.pageById)) {
      const page = payload.pageById[id];
<<<<<<< HEAD
      page.count = 0;
=======
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
      page.unreadCount = 0;
    }
    return {
      ...state,
      ...payload,
    };
  }
  if (type === changeScrollTracking.type) {
    const scrollTracking = payload;
    const nextState = {
      ...state,
      scrollTracking,
    };
    if (scrollTracking) {
<<<<<<< HEAD
      const pageId = state.currentPage;
=======
      const pageId = state.currentPageId;
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
      const page = {
        ...state.pageById[pageId],
        unreadCount: 0,
      };
      nextState.pageById = {
        ...state.pageById,
        [pageId]: page,
      };
    }
    return nextState;
  }
  if (type === updateMessageCount.type) {
    const countByType = payload;
    const pages = state.pages.map(id => state.pageById[id]);
<<<<<<< HEAD
    const nextPageById = { ...state.pageById };
    for (let page of pages) {
      let count = 0;
      let unreadCount = 0;
      for (let type of Object.keys(countByType)) {
        if (canPageAcceptType(page, type)) {
          count += countByType[type];
          if (page.id !== state.currentPage || !state.scrollTracking) {
            unreadCount += countByType[type];
          }
=======
    const currentPage = state.pageById[state.currentPageId];
    const nextPageById = { ...state.pageById };
    for (let page of pages) {
      let unreadCount = 0;
      for (let type of Object.keys(countByType)) {
        // Message does not belong here
        if (!canPageAcceptType(page, type)) {
          continue;
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
        }
        // Current page is scroll tracked
        if (page === currentPage && state.scrollTracking) {
          continue;
        }
        // This page received the same message which we can read
        // on the current page.
        if (page !== currentPage && canPageAcceptType(currentPage, type)) {
          continue;
        }
        unreadCount += countByType[type];
      }
<<<<<<< HEAD
      if (count > 0 || unreadCount > 0) {
        nextPageById[page.id] = {
          ...page,
          count: page.count + count,
=======
      if (unreadCount > 0) {
        nextPageById[page.id] = {
          ...page,
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
          unreadCount: page.unreadCount + unreadCount,
        };
      }
    }
    return {
      ...state,
      pageById: nextPageById,
    };
  }
  if (type === addChatPage.type) {
    return {
      ...state,
<<<<<<< HEAD
      currentPage: payload.id,
=======
      currentPageId: payload.id,
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
      pages: [...state.pages, payload.id],
      pageById: {
        ...state.pageById,
        [payload.id]: payload,
      },
    };
  }
  if (type === changeChatPage.type) {
    const { pageId } = payload;
    const page = {
      ...state.pageById[pageId],
      unreadCount: 0,
    };
    return {
      ...state,
<<<<<<< HEAD
      currentPage: pageId,
=======
      currentPageId: pageId,
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
      pageById: {
        ...state.pageById,
        [pageId]: page,
      },
    };
  }
  if (type === updateChatPage.type) {
    const { pageId, ...update } = payload;
    const page = {
      ...state.pageById[pageId],
      ...update,
    };
    return {
      ...state,
      pageById: {
        ...state.pageById,
        [pageId]: page,
      },
    };
  }
  if (type === toggleAcceptedType.type) {
    const { pageId, type } = payload;
    const page = { ...state.pageById[pageId] };
    page.acceptedTypes = { ...page.acceptedTypes };
    page.acceptedTypes[type] = !page.acceptedTypes[type];
    return {
      ...state,
      pageById: {
        ...state.pageById,
        [pageId]: page,
      },
    };
  }
  if (type === removeChatPage.type) {
    const { pageId } = payload;
<<<<<<< HEAD
    const currentPage = state.currentPage;
    const nextState = {
      ...state,
      currentPage,
=======
    const nextState = {
      ...state,
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
      pages: [...state.pages],
      pageById: {
        ...state.pageById,
      },
    };
    delete nextState.pageById[pageId];
    nextState.pages = nextState.pages.filter(id => id !== pageId);
    if (nextState.pages.length === 0) {
      nextState.pages.push(mainPage.id);
      nextState.pageById[mainPage.id] = mainPage;
<<<<<<< HEAD
      nextState.currentPage = mainPage.id;
    }
    if (!nextState.currentPage || nextState.currentPage === pageId) {
      nextState.currentPage = nextState.pages[0];
=======
      nextState.currentPageId = mainPage.id;
    }
    if (!nextState.currentPageId || nextState.currentPageId === pageId) {
      nextState.currentPageId = nextState.pages[0];
>>>>>>> 85c8c9edb631a2b37e013a8078d665f499e3af7b
    }
    return nextState;
  }
  return state;
};
