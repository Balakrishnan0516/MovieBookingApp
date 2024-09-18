import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MoviesList from "./components/MoviesList";
import NavBar from "./components/NavBar";
import MovieDetails from "./components/MovieDetails";
import SignUp from "./components/signInLayout/Signup";
import Login from "./components/signInLayout/Login";
import PaymentComponent from "components/PaymentComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const handleLogin = (username: string, userId: number) => {
    setUsername(username);
    setUserId(userId);
  };

  const handleLogout = () => {
    setUsername(null);
    setUserId(null);
  };

  return (
    <Router>
      <NavBar username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/movies" element={<MoviesList />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/movies/:id/payment"
          element={<PaymentComponent userId={userId} />}
        />
      </Routes>

      {/* Add ToastContainer here */}
      <ToastContainer />
    </Router>
  );
}

export default App;
