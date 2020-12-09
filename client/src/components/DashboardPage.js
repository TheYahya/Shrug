import React from 'react';
import NewUrl from './NewUrl';
import RecentUrls from './RecentUrls';
import { connect } from 'react-redux';
import QRCodeModal from './QRCodeModal';

const DashboardPage = (props) => {
  if (props.auth.isAuthenticated) {
    return (
        <div>
          <NewUrl />
          <RecentUrls /> 
          <QRCodeModal />
        </div>
    )
  }
  return (
    <div>
      <NewUrl />
    </div>
  )
}

const mapSteteToProps = (state) => {
  return {
    auth: state.auth
  };
};

export default connect(mapSteteToProps)(DashboardPage);