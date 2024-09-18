import React, { useState } from "react";
import axios from "axios";
import "../../Css/SignUp.css"; // Ensure the path is correct

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          username,
          password,
          email,
        }
      );
      setSuccess(true);
    } catch (error: any) {
      setError(error.response.data);
    }
  };

  if (success)
    return (
      <p className="success-message">Registration successful! Please log in.</p>
    );

  return (
    <div className="glassy-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Username</label>
          <input
            className="glassy-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="glassy-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            className="glassy-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="glassy-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
