import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import "../Css/ShowAddComponent.css"; // Import the CSS file

interface Movie {
  id: number;
  title: string;
}

interface Theatre {
  id: number;
  name: string;
}

const ShowAddComponent: React.FC = () => {
  const [showTime, setShowTime] = useState<string>("");
  const [showDate, setShowDate] = useState<string>("");
  const [movieId, setMovieId] = useState<string>("");
  const [theatreId, setTheatreId] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch movies and theatres for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(
          "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/movies"
        );
        const theatreResponse = await axios.get(
          "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/theatres"
        );
        setMovies(movieResponse.data._embedded.movies || []);
        setTheatres(theatreResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!showTime || !showDate || movieId === "" || theatreId === "") {
      alert("All fields are required.");
      return;
    }

    const showData = {
      movieId: Number(movieId),
      theatreId: Number(theatreId),
      date: showDate,
      time: showTime,
    };

    try {
      console.log("Show details post body: ", showData);
      const response = await axios.post(
        "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/add-show",
        showData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response from server:", response);
      setSuccessMessage("Show added successfully!");
      // Clear the form
      setShowTime("");
      setShowDate("");
      setMovieId("");
      setTheatreId("");
    } catch (error) {
      console.error("Error adding show:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Show</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Show Time (e.g., 14:30:00)"
          value={showTime}
          onChange={(e) => setShowTime(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="date"
          value={showDate}
          onChange={(e) => setShowDate(e.target.value)}
          required
          className="date-picker" // Add a class for date picker styling
        />
        <select
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Movie</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
        <select
          value={theatreId}
          onChange={(e) => setTheatreId(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Theatre</option>
          {theatres.map((theatre) => (
            <option key={theatre.id} value={theatre.id}>
              {theatre.name}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.submitButton}>
          Add Show
        </button>
      </form>
      {successMessage && (
        <div style={{ ...styles.successMessage, textAlign: "center" }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#c2c2c2",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #444",
    borderRadius: "5px",
    backgroundColor: "#222",
    color: "#ffffff",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#E50914",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  successMessage: {
    marginTop: "10px",
    color: "#00ff00",
  },
};

export default ShowAddComponent;
