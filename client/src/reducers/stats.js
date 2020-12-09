// Stats Reducer

const statsReducerDefaultState = {
  days: [],
  browsers: [],
  os: [],
  overview: {
    "code": "",
    "link": "No data",
    "top_browser": "No data",
    "top_browser_count": "0",
    "top_browser_percent": "0",
    "top_location": "No data",
    "top_location_count": "0",
    "top_location_percent": "0",
    "top_os": "No data",
    "top_os_count": "0",
    "top_os_percent": "0",
    "total_views": "0",
    "total_views_percent": "0"
  },
};

export default (state = statsReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_DAYS':
      return {
        days: action.days,
        browsers: state.browsers,
        os: state.os,
        overview: state.overview
      };
    case 'ADD_BROWSERS':
      return {
        days: state.days,
        browsers: action.browsers,
        os: state.os,
        overview: state.overview
      };
    case 'ADD_OS':
      return {
        days: state.days,
        browsers: state.browsers,
        os: action.os,
        overview: state.overview
      };
    case 'ADD_OVERVIEW':
      return {
        days: state.days,
        browsers: state.browsers,
        os: state.os,
        overview: action.overview
      };
    case 'CLEAN_UP_STATS':
      return statsReducerDefaultState
    default:
      return state;
  }
};
