import React from 'react';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render() { 
    const auth = this.props.auth.isAuthenticated === true ? <button className="btn btn-outline-secondary btn-sm" onClick={() => { this.props.startLogout() }}><FontAwesomeIcon icon={faSignOutAlt}/> Logout</button> : '';
    const userEmail = <span className="badge badge-light">{this.props.auth.email}</span>
    return (
      <header> 
        <nav className="navbar navbar-light">
          <span className="navbar-text">
            <Link className="navbar-brand" to="/">
              <img src="/images/shrug-ir.png" />
            </Link>
            <a className="navbar-text__link" href="https://github.com/theyahya/shrug" target="_blank">Github</a>
          </span>
          <div className="nav-right">
          { this.props.auth.isAuthenticated && userEmail }
          &nbsp;
          { auth }
          </div>
        </nav>
      </header>
    )
  }
} 

const mapSteteToProps = (state) => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch) => ({
  startLogout: () => dispatch(startLogout())
});

export default connect(mapSteteToProps, mapDispatchToProps)(Header);
