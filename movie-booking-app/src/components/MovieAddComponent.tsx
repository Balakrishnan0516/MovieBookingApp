import React, { useState, ChangeEvent, FormEvent } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";

const MovieAddComponent: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [director, setDirector] = useState<string>("");
  const [synopsis, setSynopsis] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleImageResize = (file: File) => {
    Resizer.imageFileResizer(
      file,
      768,
      1200,
      "PNG",
      100,
      0,
      (uri) => {
        setImage(uri as string);
        setImagePreview(uri as string);
      },
      "base64",
      768,
      1200
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageResize(file);
    }
  };

  const cleanBase64String = (base64: string) => {
    return base64.replace(/^data:image\/png;base64,/, "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!title || !image) {
      alert("Title and Image are required.");
      return;
    }

    const movieData = {
      title,
      genre,
      director,
      synopsis,
      youtubeUrl,
      image: image ? cleanBase64String(image) : "",
    };

    try {
      const response = await axios.post(
        "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/add-movie",
        movieData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response from server:", response);
      setSuccessMessage("Movie added successfully!");
      // Clear the form
      setTitle("");
      setGenre("");
      setDirector("");
      setSynopsis("");
      setYoutubeUrl("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Movie</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Synopsis"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          rows={4}
          style={styles.textarea}
        />
        <input
          type="text"
          placeholder="YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          style={styles.input}
        />
        <label style={styles.uploadButton}>
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={styles.fileInput}
          />
        </label>
        {imagePreview && (
          <div style={styles.imagePreview}>
            <h4>Image Preview:</h4>
            <img src={imagePreview} alt="Movie Preview" style={styles.image} />
          </div>
        )}
        <button type="submit" style={styles.submitButton}>
          Add Movie
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
    background: "rgba(255, 255, 255, 0.1)", // Transparent background
    backdropFilter: "blur(10px)", // Glass effect
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", // Shadow for depth
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
    backgroundColor: "#222", // Dark input background
    color: "#ffffff", // Light text color
  },
  textarea: {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #444",
    borderRadius: "5px",
    backgroundColor: "#222", // Dark textarea background
    color: "#ffffff", // Light text color
  },
  uploadButton: {
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#E50914", // Highlighted button color
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "inline-block",
    textAlign: "center",
  },
  fileInput: {
    display: "none",
  },
  imagePreview: {
    marginBottom: "10px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    maxHeight: "150px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#E50914", // Highlighted button color
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  successMessage: {
    marginTop: "10px",
    color: "#00ff00", // Light green for success message
  },
};

export default MovieAddComponent;
