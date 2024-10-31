import React, { useState } from "react";
import MovieAddComponent from "./MovieAddComponent";
import { useAuth } from "./AuthContext"; // Custom auth context
import ErrorBoundary from "../ErrorBoundary";
import TheatreAddComponent from "./TheatreAddComponent";
import SeatAddComponent from "./SeatAddComponent";
import ShowAddComponent from "./ShowAddComponent";
import UpdateMovieComponent from "./UpdateMovieComponent";
import "../Css/AdminPanel.css"; // Import CSS file for styles

export const AdminPanel: React.FC = () => {
  const { UsernameAuth } = useAuth(); // Get username from AuthContext
  const [activeComponent, setActiveComponent] = useState<string>("movie");

  // Check if the user is authorized
  if (UsernameAuth !== "Balakrish") {
    return (
      <div className="access-denied">
        Access Denied. You are not authorized to view this page.
      </div>
    );
  }

  // Function to handle component changes
  const handleComponentChange = (component: string) => {
    setActiveComponent(component);
  };

  return (
    <div className="admin-panel container">
      {/* Top panel for buttons */}
      <div className="top-panel">
        <button
          onClick={() => handleComponentChange("movie")}
          className="nav-button"
        >
          Add Movie
        </button>
        <button
          onClick={() => handleComponentChange("updateMovie")}
          className="nav-button"
        >
          Update Movie
        </button>
        <button
          onClick={() => handleComponentChange("theatre")}
          className="nav-button"
        >
          Add Theatre
        </button>
        <button
          onClick={() => handleComponentChange("show")}
          className="nav-button"
        >
          Add Show
        </button>
        <button
          onClick={() => handleComponentChange("seat")}
          className="nav-button"
        >
          Add Seats
        </button>
      </div>

      {/* Content section */}
      <div className="content-panel">
        {activeComponent === "movie" && (
          <div id="movie-add">
            <ErrorBoundary>
              <MovieAddComponent />
            </ErrorBoundary>
          </div>
        )}
        {activeComponent === "seat" && (
          <div id="seat-add">
            <ErrorBoundary>
              <SeatAddComponent />
            </ErrorBoundary>
          </div>
        )}
        {activeComponent === "theatre" && (
          <div id="theatre-add">
            <ErrorBoundary>
              <TheatreAddComponent />
            </ErrorBoundary>
          </div>
        )}
        {activeComponent === "show" && (
          <div id="show-add">
            <ErrorBoundary>
              <ShowAddComponent />
            </ErrorBoundary>
          </div>
        )}
        {activeComponent === "updateMovie" && (
          <div id="update-movie">
            <ErrorBoundary>
              <UpdateMovieComponent />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
};
