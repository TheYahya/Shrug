import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { startLogin } from '../actions/auth';

const { GOOGLE_CLIENT_ID } = process.env;

const AuthButtons = ({ login }) => {
  const responseGoogle = (response) => {
    login(response.accessToken);
  }

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  login: (accessToken) => dispatch(startLogin(accessToken)),
});

AuthButtons.propTypes = {
  login: PropTypes.func.isRequired,
};

export default connect(undefined, mapDispatchToProps)(AuthButtons);
