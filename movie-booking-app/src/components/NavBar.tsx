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
import logo from "../Logo/TC8.png";
import { BorderAllRounded } from "@mui/icons-material";

interface NavBarProps {
  username: string | null;
  onLogout: () => void;
  isAdmin?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ username, onLogout, isAdmin }) => {
  const searchButtonStyles = {
    border: "1px solid #313131", // Light blue border color
    color: "#fff", // Light blue text color
    backgroundColor: "transparent", // Transparent background
    transition: "background-color 0.3s, color 0.3s",
  };

  const searchButtonHoverStyles = {
    backgroundColor: "#242424", // Light blue background color on hover
    color: "#fff", // White text color on hover
    borderColor: "#ff5722", // Light blue border color on hover
  };

  return (
    <div className="nav-contain container">
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            width="40"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="Home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/movies" className="Movies">
              Movies
            </Nav.Link>
            <Nav.Link as={Link} to="/theatres">
              Theatres
            </Nav.Link>

            {isAdmin && ( // Conditionally render Admin link
              <Nav.Link as={Link} to="/admin">
                Admin
              </Nav.Link>
            )}
          </Nav>
          <div className="search-container">
            <Form className="d-flex">
              <FormControl
                type="text"
                placeholder="Search"
                className="search-input dark-theme"
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
                    className="custom-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/settings">
                      Settings
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={onLogout}>
                      Logout
                    </NavDropdown.Item>
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
    </div>
  );
};

export default NavBar;
