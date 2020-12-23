import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GoogleAuthorize } from 'react-google-authorize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { startLogin } from '../actions/auth';

const { GOOGLE_CLIENT_ID } = process.env;

const AuthButtons = ({ login }) => {
  const responseGoogle = (response) => login(response.access_token);

  return (
    <GoogleAuthorize
      className="btn btn-outline-danger"
      clientId={GOOGLE_CLIENT_ID}
      buttonText={(
        <span>
          <FontAwesomeIcon icon={faGoogle} />
          &nbsp;Login with Google
        </span>
      )}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
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
