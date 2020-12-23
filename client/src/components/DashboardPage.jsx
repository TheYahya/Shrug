import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCodeModal from './QRCodeModal';
import NewUrl from './NewUrl';
import RecentUrls from './RecentUrls';

const DashboardPage = ({ auth }) => {
  if (auth.isAuthenticated) {
    return (
      <>
        <NewUrl />
        <RecentUrls />
        <QRCodeModal />
      </>
    );
  }
  return <NewUrl />;
};

const mapSteteToProps = (state) => ({
  auth: state.auth,
});

DashboardPage.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired,
};

export default connect(mapSteteToProps)(DashboardPage);
