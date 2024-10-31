import React from "react";
import "../Css/Footer.css"; // Import the CSS file for footer styles
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"; // Social media icons

const Footer: React.FC = () => {
  return (
    <footer className="footer container">
      <div className="footer-container">
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="social-icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="icon" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="icon" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="icon" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="icon" />
          </a>
        </div>
        <p className="footer-text">
          © 2024 MovieBooking. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
