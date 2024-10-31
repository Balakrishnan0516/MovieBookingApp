import React, { useState, FormEvent } from "react";
import axios from "axios";

const TheatreAddComponent: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!name || !location) {
      alert("All fields are required.");
      return;
    }

    const theatreData = {
      name,
      location,
    };

    try {
      const response = await axios.post(
        "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/add-theatre",
        theatreData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response from server:", response);
      setSuccessMessage("Theatre added successfully!");
      // Clear the form
      setName("");
      setLocation("");
      setCapacity("");
    } catch (error) {
      console.error("Error adding theatre:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Theatre</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Theatre Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.submitButton}>
          Add Theatre
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

export default TheatreAddComponent;
