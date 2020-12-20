import {
  getDaysAPI,
  getBrowsersStatsAPI,
  getOSStatsAPI,
  getOverviewStatsAPI,
  getCityStatsAPI,
  getRefererStatsAPI,
} from '../api/urlAPI';

// ADD_DAYS
export const addDays = (days) => ({
  type: 'ADD_DAYS',
  days,
});

export const startAddDays = (id) => (dispatch) => {
  getDaysAPI(id).then((result) => {
    dispatch(addDays(result));
  });
};

export const addBrowsers = (browsers) => ({
  type: 'ADD_BROWSERS',
  browsers,
});

export const startAddBrowsersStats = (id) => (dispatch) => {
  getBrowsersStatsAPI(id).then((result) => {
    dispatch(addBrowsers(result));
  });
};

export const addOS = (os) => ({
  type: 'ADD_OS',
  os,
});

export const startAddOSStats = (id) => (dispatch) => {
  getOSStatsAPI(id).then((result) => {
    dispatch(addOS(result));
  });
};

export const addOverview = (overview) => ({
  type: 'ADD_OVERVIEW',
  overview,
});

export const startaddOverviewStats = (id) => (dispatch) => {
  getOverviewStatsAPI(id).then((result) => {
    dispatch(addOverview(result));
  });
};

export const cleanUpStats = () => ({
  type: 'CLEAN_UP_STATS',
});

export const addCity = (city) => ({
  type: 'ADD_CITY',
  city,
});

export const startAddCityStats = (id) => (dispatch) => {
  getCityStatsAPI(id).then((result) => {
    dispatch(addCity(result));
  });
};

export const addReferer = (referer) => ({
  type: 'ADD_REFERER',
  referer,
});

export const startAddRefererStats = (id) => (dispatch) => {
  getRefererStatsAPI(id).then((result) => {
    dispatch(addReferer(result));
  });
};
