import React from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../Css/NavBar.css"; // Ensure correct path

interface NavBarProps {
  username: string | null;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ username, onLogout }) => {
  const searchButtonStyles = {
    border: "1px solid #5bc0de", // Light blue border color
    color: "#5bc0de", // Light blue text color
    backgroundColor: "transparent", // Transparent background
    transition: "background-color 0.3s, color 0.3s",
  };

  const searchButtonHoverStyles = {
    backgroundColor: "#242424", // Light blue background color on hover
    color: "#fff", // White text color on hover
    borderColor: "#5bc0de", // Light blue border color on hover
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
      <Navbar.Brand as={Link} to="/">
        <img
          src="https://via.placeholder.com/40"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="Logo"
        />
        {" Ticket Counter"}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/movies">
            Movies
          </Nav.Link>
          <Nav.Link as={Link} to="/theatres">
            Theatres
          </Nav.Link>
          <Nav.Link as={Link} to="/upcoming">
            Upcoming Movies
          </Nav.Link>
        </Nav>
        <div className="search-container">
          <Form className="d-flex">
            <FormControl
              type="text"
              placeholder="Search"
              className="search-input"
            />
            <Button
              variant="outline-info"
              style={searchButtonStyles}
              onMouseOver={(e) =>
                Object.assign(e.currentTarget.style, searchButtonHoverStyles)
              }
              onMouseOut={(e) =>
                Object.assign(e.currentTarget.style, searchButtonStyles)
              }
            >
              Search
            </Button>
          </Form>
          <Nav>
            {username ? (
              <>
                <NavDropdown
                  title={username}
                  id="basic-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/settings">
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-button">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="nav-link-button">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
