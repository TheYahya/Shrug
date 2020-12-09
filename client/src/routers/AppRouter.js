import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import DashboardPage from '../components/DashboardPage';
import NotFoundPage from '../components/NotFoundPage';
import UrlStats from '../components/UrlStats';
import Header from '../components/Header'; 

export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>  
      <Header />
      <Switch>
        <Route path="/" component={DashboardPage} exact={true} />
        <Route path="/stats/:id" component={UrlStats} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
