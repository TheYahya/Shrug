var axios = require('axios');
import { getCookie } from '../utils';

var BASE_URL = process.env.API_BASE_URL

export const add = (url = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  var data = url
  return axios.post(`${BASE_URL}/api/v1/urls`, data, {
    headers: headers
  })
  .then((response) => {
    return response
  })
  .catch((error) => {
    return error.response
  })
}

export const update = (url = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  var data = url
  return axios.patch(`${BASE_URL}/api/v1/urls`, data, {
    headers: headers
  })
  .then((response) => {
    return response
  })
  .catch((error) => {
    return error.response
  })
}

export const getUrls = (offset = 0, limit = 0, search = '') => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  
  return axios.get(`${BASE_URL}/api/v1/urls?offset=${offset}&limit=${limit}&search=${search}`, {
    headers: headers
  })
  .then((response) => {
    return response.data
  })
  .catch((error) => {
  })
}

export const deleteUrl = (id) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  
  return axios.delete(`${BASE_URL}/api/v1/urls/${id}`, {
    headers: headers
  })
  .then((response) => {
    return response.data
  })
  .catch((error) => {
    return error.response.data
  })
}

export const getDaysAPI = (id) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  
  return axios.get(`${BASE_URL}/api/v1/histogram/${id}`, {
    headers: headers
  })
  .then((response) => {
    return response.data
  })
  .catch((error) => {
  })
}

export const getBrowsersStatsAPI = (id) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  
  return axios.get(`${BASE_URL}/api/v1/browsers-stats/${id}`, {
    headers: headers
  })
  .then((response) => {
    return response.data.response
  })
  .catch((error) => {
  })
}

export const getOSStatsAPI = (id) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  
  return axios.get(`${BASE_URL}/api/v1/os-stats/${id}`, {
    headers: headers
  })
  .then((response) => {
    return response.data.response
  })
  .catch((error) => {
  })
}

export const getOverviewStatsAPI = (id) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  
  return axios.get(`${BASE_URL}/api/v1/overview-stats/${id}`, {
    headers: headers
  })
  .then((response) => {
    return response.data.response
  })
  .catch((error) => {
  })
}

export const getCityStatsAPI = (id) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  
  return axios.get(`${BASE_URL}/api/v1/city-stats/${id}`, {
    headers: headers
  })
  .then((response) => {
    return response.data.response
  })
  .catch((error) => {
  })
}

export const getRefererStatsAPI = (id) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  
  return axios.get(`${BASE_URL}/api/v1/referer-stats/${id}`, {
    headers: headers
  })
  .then((response) => {
    return response.data.response
  })
  .catch((error) => {
  })
}
