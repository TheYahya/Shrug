// Stats Reducer

const statsReducerDefaultState = {
  days: [],
  browsers: [],
  os: [],
  city: [],
  referer: [],
  overview: {
    code: '',
    link: 'No data',
    top_browser: 'No data',
    top_browser_count: '0',
    top_browser_percent: '0',
    top_location: 'No data',
    top_location_count: '0',
    top_location_percent: '0',
    top_os: 'No data',
    top_os_count: '0',
    top_os_percent: '0',
    total_views: '0',
    total_views_percent: '0',
  },
};

export default (state = statsReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_DAYS':
      return {
        ...state,
        days: action.days,
      };
    case 'ADD_BROWSERS':
      return {
        ...state,
        browsers: action.browsers,
      };
    case 'ADD_OS':
      return {
        ...state,
        os: action.os,
      };
    case 'ADD_CITY':
      return {
        ...state,
        city: action.city,
      };
    case 'ADD_REFERER':
      return {
        ...state,
        referer: action.referer,
      };
    case 'ADD_OVERVIEW':
      return {
        ...state,
        overview: action.overview,
      };
    case 'CLEAN_UP_STATS':
      return statsReducerDefaultState;
    default:
      return state;
  }
};
