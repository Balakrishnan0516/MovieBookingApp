import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Typography, Button } from "@mui/joy";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow"; // Import the play icon
import LoadingComponent from "./LoadingComponent";

interface Movie {
  id: number;
  title: string;
  genre: string;
  director: string;
  synopsis: string;
  image: string;
}

const MoviesList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(
        "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/movies"
      )
      .then((response) => {
        setMovies(response.data._embedded.movies);
      })
      .catch((error) => {
        console.error("There was an error fetching the movies!", error);
      });
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
  };

  if (movies.length === 0) {
    return <LoadingComponent loading={loading} />; // Use the loading component
  }

  const previousIndex = (currentIndex - 1 + movies.length) % movies.length;
  const nextIndex = (currentIndex + 1) % movies.length;

  return (
    <div className="container">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          color="primary"
          style={{
            background: "linear-gradient(50deg, #404046, #202020)", // Dark gradient // Gradient color
            color: "white",
            fontWeight: "bold",
            padding: "10px 20px",

            fontSize: "16px",
            margin: "auto",
            marginBottom: "8px",
          }}
        >
          Grab your tickets now!
        </Button>
      </div>
      <div className="slider-container">
        <button className="slider-button left" onClick={handlePrevious}>
          <PlayArrowIcon
            sx={{ color: "#FAF9F6", transform: "rotate(180deg)" }}
          />{" "}
          {/* White icon color */}
        </button>
        <div className="slider">
          <div
            className="slider-content"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className={`slider-item ${index === currentIndex ? "active" : ""}`}
              >
                <div className="slider-image-container">
                  <img
                    src={`data:image/png;base64,${movie.image}`}
                    className="slider-image"
                    alt={movie.title}
                  />
                  <div className="slider-info">
                    <h5 className="slider-title">{movie.title}</h5>
                    <p className="slider-text">{movie.synopsis}</p>
                    <Link
                      to={`/movies/${movie.id}`}
                      className="btn btn-primary"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="slider-item-adjacent left slider-content">
            <img
              src={`data:image/png;base64,${movies[previousIndex].image}`}
              alt={movies[previousIndex].title}
            />
          </div>
          <div className="slider-item-adjacent right slider-content">
            <img
              src={`data:image/png;base64,${movies[nextIndex].image}`}
              alt={movies[nextIndex].title}
            />
          </div>
        </div>
        <button className="slider-button right" onClick={handleNext}>
          <PlayArrowIcon sx={{ color: "#FAF9F6" }} /> {/* White icon color */}
        </button>
      </div>
    </div>
  );
};

export default MoviesList;
