import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import 'react-dates/lib/css/_datepicker.css';
import { startGetUrls } from './actions/urls';
import { startLoadUser } from './actions/auth';
import { getCookie } from './utils';

import 'normalize.css/normalize.css';
import './styles/styles.scss';

const store = configureStore();

if (getCookie('jwtToken')) {
  store.dispatch(startLoadUser());
  store.dispatch(startGetUrls());
}

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
