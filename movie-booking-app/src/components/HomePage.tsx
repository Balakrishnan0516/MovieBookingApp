import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "../Css/HomePage.css";
import LoadingComponent from "./LoadingComponent";

interface Movie {
  id: number;
  title: string;
  genre: string;
  director: string;
  synopsis: string;
  image: string;
  youtubeUrl: string;
  horizontalImage: string;
}

interface Theatre {
  id: number;
  name: string;
  location: string;
}

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch movies
    fetch(
      "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/movies"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data._embedded && data._embedded.movies) {
          setMovies(data._embedded.movies);
        } else {
          console.error("Movies not found in the API response.");
        }
      });

    // Fetch theatres
    fetch(
      "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/theatres"
    )
      .then((response) => response.json())
      .then((data: Theatre[]) => setTheatres(data));
  }, []);

  // Navigate to booking page
  const handleBookNow = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  if (movies.length === 0) {
    return <LoadingComponent loading={loading} />; // Use the loading component
  }

  return (
    <div className="homepage-container container">
      {/* Hero Section */}
      <Carousel
        indicators={true}
        animation="slide"
        interval={4000}
        className="movie-carousel"
      >
        {movies
          .slice(2) // Start from the third movie
          .concat(movies.slice(0, 2)) // Append the first two movies at the end
          .map((movie) => (
            <div
              key={movie.id} // Ensure each movie has a unique key
              className="hero-section"
              style={{
                backgroundImage: `url(data:image/jpeg;base64,${movie.horizontalImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                height: "500px",
                borderRadius: "10px",
              }}
            >
              <div className="hero-overlay">
                <h1>{movie.title}</h1>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleBookNow(movie.id)}
                  className="hero-book-button"
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
      </Carousel>

      {/* Movie Carousel */}

      {/* Featured Movies Section */}
      <div className="featured-movies-section">
        <div className="Recommentalign">
          <div className="recommended-content">
            <h5>Recommended Movies</h5>
            <div className="divbar" />
          </div>
        </div>
        <div className="featured-movies-container">
          {movies.slice(0, 8).map((movie) => (
            <div key={movie.id} className="featured-movie-card">
              <img
                src={`data:image/jpeg;base64,${movie.image}`}
                alt={movie.title}
                className="featured-movie-poster"
              />
              <div className="featured-movie-info">
                <h6>{movie.title}</h6>
                <Button
                  sx={{
                    background: "linear-gradient(90deg, #4a4a4a, #1a1a1a)",

                    backdropFilter: "blur(10px)",
                    color: "orange",
                    padding: "8px 20px",
                    border: "none",
                    borderRadius: "30px",
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                  onClick={() => handleBookNow(movie.id)}
                >
                  Grab Your Tickets Now!
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theatres Section */}
      <div className="theatres-section">
        <div className="Recommentalign">
          <div className="recommended-content">
            <h5>Available Theatres</h5>
            <div className="divbar" />
          </div>
        </div>

        <div className="theatre-list">
          {theatres.map((theatre) => (
            <>
              <Button
                sx={{
                  background: "linear-gradient(90deg, #4a4a4a, #1a1a1a)",

                  backdropFilter: "blur(10px)",
                  color: "orange",
                  padding: "8px 20px",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                <h5>{theatre.name}</h5>
                <div key={theatre.id} className="theatre-card-2">
                  <LocationOnIcon className="theatre-icon" />

                  <p>{theatre.location}</p>
                </div>
              </Button>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
