import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import DashboardPage from '../components/DashboardPage';
import NotFoundPage from '../components/NotFoundPage';
import UrlStats from '../components/UrlStats';
import Header from '../components/Header';

export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
      <Header />
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path="/stats/:id" element={<UrlStats />} />
        <Route element={<NotFoundPage />} />
      </Routes>
  </Router>
);

export default AppRouter;
