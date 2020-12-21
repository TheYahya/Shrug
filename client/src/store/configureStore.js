import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import urlsReducer from '../reducers/urls';
import statsReducer from '../reducers/stats';
import qrcodeReducer from '../reducers/qrcode';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      urls: urlsReducer,
      stats: statsReducer,
      qrcode: qrcodeReducer,
    }),
    composeEnhancers(applyMiddleware(thunk)),
  );

  return store;
};
