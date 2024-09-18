import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Css/SignUp.css"; // Reusing the same CSS file

interface LoginProps {
  onLogin: (username: string, userId: number) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Replace the URL with your actual login endpoint
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        }
      );

      // Assuming the response contains a success status and user data
      if (response.status === 200) {
        const userResponse = await axios.get(
          `http://localhost:8080/api/auth/users/${username}`
        );
        const userId = userResponse.data;

        onLogin(username, userId);
        navigate("/movies");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="glassy-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            className="glassy-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div className="form-group">
          <input
            className="glassy-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="glassy-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
