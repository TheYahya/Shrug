import { loginAPI, getUserAPI } from '../api/authAPI';
import { startGetUrls } from './urls';
import { getCookie, setCookie, eraseCookie } from '../utils';

export const login = (
  {
    email = '',
    jwtToken = '',
  },
) => ({
  type: 'LOGIN',
  email,
  jwtToken,
});

export const startLogin = (accessToken) => (dispatch) => {
  loginAPI(accessToken).then((result) => {
    setCookie('jwtToken', result.jwtToken, 7);
    dispatch(login({
      email: result.email,
      jwtToken: result.jwtToken,
    }));
    dispatch(startGetUrls());
  });
};

export const loadUser = (
  {
    email = '',
    jwtToken = '',
  },
) => ({
  type: 'LOAD_USER',
  email,
  jwtToken,
});

export const startLoadUser = (accessToken) => (dispatch) => {
  getUserAPI(accessToken).then((result) => {
    dispatch(loadUser({
      email: result.email,
      jwtToken: getCookie('jwtToken'),
    }));
  });
};

export const logout = () => ({
  type: 'LOGOUT',
});

export const startLogout = () => (dispatch) => {
  eraseCookie('jwtToken');
  dispatch(logout());
};
