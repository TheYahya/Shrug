var axios = require('axios');
import { getCookie, setCookie, eraseCookie } from '../utils';

var BASE_URL = process.env.API_BASE_URL

export const loginAPI = (accessToken) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  var data = {
    access_token: accessToken
  }
  return axios.post(`${BASE_URL}/api/v1/google/auth`, data, {
    headers: headers
  })
  .then((response) => {
    return response.data
  })
  .catch((error) => {
  })
}

export const getUserAPI = (accessToken) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getCookie("jwtToken")
  }
  var data = {
    access_token: accessToken
  }
  return axios.get(`${BASE_URL}/api/v1/users`, {
    headers: headers
  })
  .then((response) => {
    return response.data
  })
  .catch((error) => {
  })
}
