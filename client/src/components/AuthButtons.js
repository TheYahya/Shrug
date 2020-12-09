import { connect } from 'react-redux';
import React, { Component } from 'react'
import { GoogleAuthorize } from 'react-google-authorize';
import { startLogin } from '../actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

class AuthButtons extends React.Component { 
  responseGoogle = (response) => {
    let accessToken = response.access_token
    this.props.startLogin(accessToken)
  }
  render() {
    return (
      <GoogleAuthorize
      className="btn btn-outline-danger"
      clientId={GOOGLE_CLIENT_ID}
      buttonText={<span><FontAwesomeIcon  icon={faGoogle} /> Login with Google</span>}
      onSuccess={this.responseGoogle}
      onFailure={this.responseGoogle}
    />
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  startLogin: (accessToken) => dispatch(startLogin(accessToken))
});

export default connect(undefined, mapDispatchToProps)(AuthButtons);
