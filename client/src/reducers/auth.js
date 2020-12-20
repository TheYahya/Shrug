import { getCookie } from '../utils';

const jwtToken = getCookie('jwtToken');

const defaultAuth = {
  isAuthenticated: false,
  email: null,
  jwtToken,
};

export default (state = defaultAuth, action) => {
  switch (action.type) {
    case 'LOAD_USER':
    case 'LOGIN':
      return {
        isAuthenticated: true,
        email: action.email,
        jwtToken: action.jwtToken,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        email: null,
        jwtToken: null,
      };
    default:
      return state;
  }
};
