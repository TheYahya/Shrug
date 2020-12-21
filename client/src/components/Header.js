import React from 'react';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Container, Navbar, Nav, Button, Badge } from 'react-bootstrap';

const Header = ({ auth, startLogout }) => {
  const { isAuthenticated, email } = auth;

  const logout = () => startLogout();

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
          <Nav.Link to="/">
            <img src="/images/shrug-ir.png" />
          </Nav.Link>
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
                  variant="light"
                  className="mr-1"
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
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </Button>
                )
              }
            </Navbar.Text>
          </div>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
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
