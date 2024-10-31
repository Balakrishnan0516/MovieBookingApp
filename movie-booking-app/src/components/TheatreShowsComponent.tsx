import React, { useEffect, useState } from "react";
import axios from "axios";
import TheatreMoviesComponent from "./TheatreMoviesComponent";
import "../Css/TheatreComponent.css";

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

interface Show {
  id: number;
  movie: Movie;
  theatre: Theatre;
  date: string;
  time: string;
}

const TheatreShowsComponent: React.FC = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheatreShows = async () => {
      try {
        const response = await axios.get(
          "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/theatres"
        ); // Adjust API endpoint accordingly
        setTheatres(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching theatre details:", err);
        setError("There was an error fetching the theatre details.");
        setLoading(false);
      }
    };
    fetchTheatreShows();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="theatre-shows container">
      {theatres.map((theatre) => (
        <TheatreMoviesComponent key={theatre.id} theatre={theatre} />
      ))}
    </div>
  );
};

export default TheatreShowsComponent;
