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
import TicketConfirmation from "components/TicketConfirmation";
import Profile from "components/Profile";
import { AdminPanel } from "components/AdminPanel";
import { AuthProvider } from "./components/AuthContext";
import ErrorBoundary from "./ErrorBoundary";
import HomePage from "components/HomePage";
import TheatreShowsComponent from "components/TheatreShowsComponent";
import TheatreMoviesComponent from "components/TheatreMoviesComponent";
import Footer from "components/Footer";
import LoadingAnimation from "components/LoadingAnimation";
import LoadingComponent from "components/LoadingComponent";

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

  const isAdmin = username === "Balakrish";

  return (
    <Router>
      <NavBar username={username} onLogout={handleLogout} isAdmin={isAdmin} />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/loading"
            element={<LoadingComponent loading={true} />}
          />
          <Route path="/profile" element={<Profile userId={userId} />} />
          <Route path="/movies" element={<MoviesList />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/movies/:id/payment"
            element={<PaymentComponent userId={userId} />}
          />
          <Route path="/confirmation" element={<TicketConfirmation />} />

          <Route path="/theatres" element={<TheatreShowsComponent />} />

          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </ErrorBoundary>

      {/* Add ToastContainer here */}
      <ToastContainer />

      <Footer />
    </Router>
  );
}

export default App;
