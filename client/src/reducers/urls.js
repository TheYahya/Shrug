// Urls Reducer

const urlsReducerDefaultState = {
  urls: [],
  total: 0,
  offset: 0,
  limit: 0,
  search: '',
  currentTotal: 0,
  addUrlError: null,
};

export default (state = urlsReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_URL': {
      const urls = [
        ...state.urls,
        action.url,
      ];
      return {
        ...state,
        urls: urls.sort(
          (a, b) => {
            const aDatetime = Date.parse(a.createdAt);
            const bDatetime = Date.parse(b.createdAt);

            if (aDatetime < bDatetime) {
              return 1;
            }
            if (aDatetime > bDatetime) {
              return -1;
            }
            return 0;
          },
        ),
        currentTotal: urls.length,
      };
    }
    case 'UPDATE_URL': {
      const urls = state.urls.map((url) => (url.id === action.url.id ? action.url : url));
      return {
        ...state,
        urls,
      };
    }
    case 'REMOVE_URL': {
      const urls = state.urls.filter(({ id }) => id !== action.id);
      return {
        ...state,
        urls,
        currentTotal: urls.length,
      };
    }
    case 'CLEAN_UP_URLS':
      return urlsReducerDefaultState;
    case 'SET_TOTAL': {
      const { total } = action;
      return {
        ...state,
        total,
      };
    }
    case 'SET_OFFSET': {
      const { offset } = action;
      return {
        ...state,
        offset,
      };
    }
    case 'SET_LIMIT': {
      const { limit } = action;
      return {
        ...state,
        limit,
      };
    }
    case 'SET_SEARCH': {
      const { search } = action;
      return {
        ...state,
        search,
      };
    }
    case 'SET_ADD_URL_ERROR': {
      const { addUrlError } = action;
      return {
        ...state,
        addUrlError,
      };
    }
    default:
      return state;
  }
};
