import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import {
  Container,
  Navbar,
  Nav,
  Button,
  Badge,
} from 'react-bootstrap';
import { startLogout } from '../actions/auth';

const Header = ({ auth, logout }) => {
  const { isAuthenticated, email } = auth;

  return (
    <Container
      as="header"
      fluid
    >
      <Navbar
        bg="transparent"
        expand="md"
        collapseOnSelect
      >
        <Navbar.Brand>
          <Link to="/">
            <img alt="logo" src="/images/shrug-ir.png" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <div className="d-flex w-100">
            <Nav className="mr-auto">
              <Nav.Link
                href="https://github.com/theyahya/shrug"
                target="blank"
              >
                Github
              </Nav.Link>
            </Nav>
            <Navbar.Text>
              {isAuthenticated && (
                <Badge
                  className="mr-1 bg-light"
                >
                  {email}
                </Badge>
              )}
              {
                isAuthenticated && (
                  <Button
                    onClick={logout}
                    variant="outline-secondary"
                    size="sm"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </Button>
                )
              }
            </Navbar.Text>
          </div>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

const mapSteteToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(startLogout()),
});

Header.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired,
  logout: PropTypes.func.isRequired,
};

export default connect(mapSteteToProps, mapDispatchToProps)(Header);
