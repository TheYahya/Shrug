// Urls Reducer

const urlsReducerDefaultState = {
  urls: [],
  total: 0,
  offset: 0,
  limit: 0,
  search: '',
  currentTotal: 0,
  addUrlError: null
};

export default (state = urlsReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_URL':
      var urls = [
        ...state.urls,
        action.url
      ];
      state.urls = urls.sort((a,b) => (Date.parse(a.createdAt) < Date.parse(b.createdAt)) ? 1 : ((Date.parse(b.createdAt) < Date.parse(a.createdAt)) ? -1 : 0));
      state.currentTotal = state.urls.length
      return {
        ...state,
        urls
      }
    case 'UPDATE_URL':
      var urls = state.urls.map(function(url) { return url.id == action.url.id ? action.url: url; })
      return {
        ...state,
        urls
      }
    case 'REMOVE_URL':
      var urls = state.urls.filter(({ id }) => id !== action.id);
      state.urls = urls.sort((a,b) => (Date.parse(a.createdAt) < Date.parse(b.createdAt)) ? 1 : ((Date.parse(b.createdAt) < Date.parse(a.createdAt)) ? -1 : 0));
      state.currentTotal = state.urls.length
      return {
        ...state,
        urls
      } 
    case 'CLEAN_UP_URLS':
      return urlsReducerDefaultState
    case 'SET_TOTAL':
      const total = action.total
      return {
        ...state,
        total
      }
    case 'SET_OFFSET':
      const offset = action.offset
      return {
        ...state,
        offset
      }
    case 'SET_LIMIT':
      const limit = action.limit
      return {
        ...state,
        limit
      }
    case 'SET_SEARCH':
      const search = action.search
      return {
        ...state,
        search
      }
    case 'SET_ADD_URL_ERROR':
      const addUrlError = action.addUrlError
      return {
        ...state,
        addUrlError
      }
    default:
      return state;
  }
};
