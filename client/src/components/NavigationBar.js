import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { ShoppingCartOutlined, AddCircleOutline, Visibility } from '@mui/icons-material';

const NavigationBar = () => {
  const { state, dispatch } = useAuth();

  const onLogOut = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'SET_ADMIN', payload: false });
    window.location.href = "/";
  };

  return (
    <Navbar bg="dark" expand="lg" id="my-navbar" variant="dark" style={{ fontWeight: 'bold', fontSize: '20px' }}>
      <Navbar.Brand href="/" className="mx-3" style={{ fontFamily: 'Saira Condensed', fontSize: '25px' }}>
        IT Solutions
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse className="mx-3">
        <Nav className="m-auto">
          {state.isAuthenticated && state.isAdmin && (
            <>
              <Nav.Link href="/">
                <Button variant="light" className="mx-2 text-dark">
                  <Visibility style={{ marginRight: '5px' }} /> Vizualizare produse
                </Button>
              </Nav.Link>

              <Nav.Link href="/add-product/">
                <Button variant="light" className="mx-2 text-dark d-flex align-items-center">
                  <AddCircleOutline style={{ marginRight: '5px' }} />
                  Adaugă produse
                </Button>
              </Nav.Link>
            </>
          )}
          {state.isAuthenticated && !state.isAdmin && (
            <Nav.Link href="/">
              <Button variant="light" className="mx-2 text-dark">Vizualizare produse</Button>
            </Nav.Link>
          )}
        </Nav>
        <Nav className="d-flex align-items-center">
          {/* Tipul de utilizator */}
          {state.isAuthenticated && (
            <span style={{ color: 'white', marginRight: '15px', fontSize: '18px' }}>
              Conectat ca: <strong>{state.isAdmin ? 'Admin' : 'Utilizator'}</strong>
            </span>
          )}

          <Nav.Link
            href={state.isAuthenticated ? '/cart' : '/login'}
            className="d-flex align-items-center my-2 position-relative"
          >
            <Button variant="light" className="mx-2 text-dark">
              <ShoppingCartOutlined style={{ marginRight: '8px' }} />
              <span style={{ color: '#000' }}>Coș de cumpărături</span>
            </Button>
          </Nav.Link>

          {/* Buton Logout */}
          {state.isAuthenticated ? (
            <Nav.Link onClick={onLogOut} className="my-2">
              <Button variant="outline-danger">Logout</Button>
            </Nav.Link>
          ) : (
            /* Buton Login */
            <Nav.Link href="/login" className="my-2">
              <Button variant="outline-primary">Login</Button>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
