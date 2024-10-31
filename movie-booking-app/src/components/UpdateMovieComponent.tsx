import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";

interface Movie {
  id: number;
  title: string;
  genre: string;
  director: string;
  synopsis: string;
  image: string;
  horizontalImage: string;
  youtubeUrl: string;
}

const UpdateMovieComponent: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [movieId, setMovieId] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [horizontalImagePreview, setHorizontalImagePreview] = useState<
    string | null
  >(null);

  const handleImageResizeVericle = (file: File) => {
    Resizer.imageFileResizer(
      file,
      768,
      1200,
      "PNG",
      100,
      0,
      (uri) => {
        setImagePreview(uri as string);
        //setHorizontalImagePreview(uri as string);
      },
      "base64",
      768,
      1200
    );
  };

  const handleImageResizeHorizontal = (file: File) => {
    Resizer.imageFileResizer(
      file,
      768,
      1200,
      "PNG",
      100,
      0,
      (uri) => {
        setHorizontalImagePreview(uri as string);
        //setHorizontalImagePreview(uri as string);
      },
      "base64",
      768,
      1200
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(
          "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/movies"
        );
        setMovies(movieResponse.data._embedded.movies || []);
        setMovie(movieResponse.data._embedded.movies[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;
      try {
        const response = await axios.get(
          `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/movies/${movieId}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    fetchMovie();
  }, [movieId]);

  const cleanBase64String = (base64: string) => {
    return base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!movie) return;

    const formData = {
      title: movie.title,
      genre: movie.genre,
      director: movie.director,
      synopsis: movie.synopsis,
      youtubeUrl: movie.youtubeUrl,
      image: movie.image, // Clean base64 string
      horizontalImage: movie.horizontalImage,
    };

    if (horizontalImagePreview) {
      formData.horizontalImage = cleanBase64String(horizontalImagePreview);
    }

    if (imagePreview) {
      formData.image = cleanBase64String(imagePreview);
    }

    const horizontalImageSize = horizontalImagePreview?.length;
    console.log("Patch form data: ", formData);
    console.log("Patch - Image length : ", horizontalImageSize);
    try {
      const response = await axios.patch(
        `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/patch/${movieId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response from server:", response);
      setSuccessMessage("Movie updated successfully!");
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (movie) {
      setMovie({ ...movie, [name]: value });
    }
  };

  const handleImageChangeVerticle = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageResizeVericle(file);
    }
  };

  const handleImageChangeHorizontal = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageResizeHorizontal(file);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Update Movie</h2>
      {movie ? (
        <form onSubmit={handleSubmit} style={styles.form}>
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

          <input
            type="text"
            name="title"
            placeholder="Movie Title"
            value={movie.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={movie.genre}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="director"
            placeholder="Director"
            value={movie.director}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="synopsis"
            placeholder="Synopsis"
            value={movie.synopsis}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="youtubeUrl"
            placeholder="YouTube URL"
            value={movie.youtubeUrl}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {/* Existing Image Display and Input */}
          <label style={styles.label}>Current Image:</label>
          {movie.image && (
            <img
              src={`data:image/jpeg;base64,${movie.image}`}
              alt="Current"
              style={styles.imagePreview}
            />
          )}
          <label style={styles.label}>Upload New Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChangeVerticle(e)}
            style={styles.input}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
          )}

          {/* Existing Horizontal Image Display and Input */}
          <label style={styles.label}>Current Horizontal Image:</label>
          {movie.horizontalImage && (
            <img
              src={`data:image/jpeg;base64,${movie.horizontalImage}`}
              alt="Current Horizontal"
              style={styles.imagePreview}
            />
          )}
          <label style={styles.label}>Upload New Horizontal Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChangeHorizontal(e)}
            style={styles.input}
          />
          {horizontalImagePreview && (
            <img
              src={horizontalImagePreview}
              alt="Horizontal Preview"
              style={styles.imagePreview}
            />
          )}

          <button type="submit" style={styles.submitButton}>
            Update Movie
          </button>
        </form>
      ) : (
        <div>Loading movie data...</div>
      )}
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
  label: {
    marginBottom: "5px",
    color: "#c2c2c2",
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
  imagePreview: {
    marginTop: "10px",
    maxWidth: "100%",
    height: "auto",
  },
};

export default UpdateMovieComponent;
