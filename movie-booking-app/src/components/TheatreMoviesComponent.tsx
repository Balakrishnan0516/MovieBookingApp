import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Css/TheatreComponent.css"; // Ensure the path is correct
import { Button } from "@mui/material";
import LoadingComponent from "./LoadingComponent";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  image: string; // Assuming this is base64 or a URL
}

interface Show {
  id: number;
  time: string;
  movie: Movie;
}

interface TheatreProps {
  theatre: {
    id: number;
    name: string;
    location: string;
  };
}

const TheatreMoviesComponent: React.FC<TheatreProps> = ({ theatre }) => {
  const [moviesWithShows, setMoviesWithShows] = useState<
    Record<string, Show[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(
          `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/movies-shows-by-theatre/${theatre.id}`
        );
        setMoviesWithShows(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching shows:", err);
        setError("There was an error fetching the show details.");
        setLoading(false);
      }
    };
    fetchShows();
  }, [theatre.id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <LoadingComponent loading={loading} />; // Use the loading component
  }

  // Navigate to booking page
  const handleBookNow = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="theatre-container-2">
      <h2 className="theatre-title">{theatre.name}</h2>
      <p className="theatre-location">{theatre.location}</p>

      <div className="movies-container-2">
        {Object.entries(moviesWithShows).map(([movieTitle, shows]) => (
          <div key={movieTitle} className="movie-container-2">
            <div className="show-list">
              {shows.map((show) => {
                const imageSrc = `data:image/jpeg;base64,${show.movie.image}`; // Adjust the image type if needed
                return (
                  <div key={show.id} className="show-container">
                    <h2 className="movie-title">{show.movie.title}</h2>
                    <img
                      src={imageSrc}
                      alt={show.movie.title}
                      className="movie-image"
                    />
                    <div className="movie-details">
                      <Button
                        sx={{
                          background:
                            "linear-gradient(90deg, #4a4a4a, #1a1a1a)",

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
                        onClick={() => handleBookNow(show.movie.id)}
                      >
                        Showtime: {show.time}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatreMoviesComponent;
