import uuid from 'uuid';
import {
  add,
  getUrls,
  deleteUrl,
  update,
} from '../api/urlAPI';

const { alert } = window;

// ADD_URL
export const addUrl = (
  {
    id = uuid(),
    shortCode = '',
    link = '',
    visitsCount = 0,
    createdAt = '',
  },
) => ({
  type: 'ADD_URL',
  url: {
    id,
    shortCode,
    link,
    visitsCount,
    createdAt,
  },
});

// SET_ADD_URL_ERROR
export const setAddUrlError = (addUrlError = null) => ({
  type: 'SET_ADD_URL_ERROR',
  addUrlError,
});

export const startAddUrl = (url = {}) => (dispatch) => {
  dispatch(setAddUrlError(null));
  add(url).then((result) => {
    if (result.data.ok === true) {
      dispatch(addUrl({
        id: result.data.response.id,
        shortCode: result.data.response.short_code,
        link: result.data.response.link,
        createdAt: result.data.response.created_at,
      }));
    } else {
      dispatch(setAddUrlError(result.data.message));
    }
  });
};

// UPDATE_URL
export const updateUrl = (
  {
    id = uuid(),
    shortCode = '',
    link = '',
    visitsCount = 0,
    createdAt = '',
  },
) => ({
  type: 'UPDATE_URL',
  url: {
    id,
    shortCode,
    link,
    visitsCount,
    createdAt,
  },
});

export const startUpdateUrl = (url = {}) => (dispatch) => {
  update(url).then((result) => {
    if (result.data.ok === true) {
      dispatch(updateUrl({
        id: result.data.response.id,
        shortCode: result.data.response.short_code,
        link: result.data.response.link,
        visitsCount: result.data.response.visits_count,
        createdAt: result.data.response.created_at,
      }));
    } else {
      alert(result.data.message);
    }
  });
};

export const cleanUpUrls = () => ({
  type: 'CLEAN_UP_URLS',
});

export const setTotal = (total = 0) => ({
  type: 'SET_TOTAL',
  total,
});

export const setOffset = (offset = 0) => ({
  type: 'SET_OFFSET',
  offset,
});

export const setLimit = (limit = 0) => ({
  type: 'SET_LIMIT',
  limit,
});

export const setSearch = (search = '') => ({
  type: 'SET_SEARCH',
  search,
});

export const startGetUrls = (offset = 0, limit = 0, search = '') => (dispatch) => {
  getUrls(offset, limit, search).then((results) => {
    dispatch(cleanUpUrls());
    dispatch(setTotal(results.response.pagination.total));
    dispatch(setOffset(results.response.pagination.offset));
    dispatch(setLimit(results.response.pagination.limit));
    dispatch(setSearch(search));
    results.response.data.forEach((result) => {
      dispatch(addUrl({
        id: result.id,
        shortCode: result.short_code,
        link: result.link,
        visitsCount: result.visits_count,
        createdAt: result.created_at,
      }));
    });
  });
};

// REMOVE_URL
export const removeUrl = ({ id } = {}) => ({
  type: 'REMOVE_URL',
  id,
});

export const startRemoveUrl = ({ id } = {}) => (dispatch) => {
  deleteUrl(id).then((result) => {
    if (result.ok === true) {
      dispatch(removeUrl({ id }));
    } else {
      alert(result.message);
    }
  });
};
