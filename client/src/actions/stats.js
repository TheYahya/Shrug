import { getDaysAPI, getBrowsersStatsAPI, getOSStatsAPI, getOverviewStatsAPI } from '../api/urlAPI';

// ADD_DAYS
export const addDays = (days) => ({
  type: 'ADD_DAYS',
  days: days
});

export const startAddDays = (id) => {
  return (dispatch) => {
    getDaysAPI(id).then((result) => {
      dispatch(addDays(result))
    })
  }
}

export const addBrowsers = (browsers) => ({
  type: 'ADD_BROWSERS',
  browsers: browsers
});

export const startAddBrowsersStats = (id) => {
  return (dispatch) => {
    getBrowsersStatsAPI(id).then((result) => {
      dispatch(addBrowsers(result))
    })
  }
}

export const addOS = (os) => ({
  type: 'ADD_OS',
  os: os
});

export const startAddOSStats = (id) => {
  return (dispatch) => {
    getOSStatsAPI(id).then((result) => {
      dispatch(addOS(result))
    })
  }
}

export const addOverview = (overview) => ({
  type: 'ADD_OVERVIEW',
  overview: overview
});

export const startaddOverviewStats = (id) => {
  return (dispatch) => {
    getOverviewStatsAPI(id).then((result) => {
      dispatch(addOverview(result))
    })
  }
}

export const cleanUpStats = () => ({
  type: 'CLEAN_UP_STATS'
})
