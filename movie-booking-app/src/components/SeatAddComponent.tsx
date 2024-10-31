import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";

const SeatAddComponent: React.FC = () => {
  const [theatreId, setTheatreId] = useState<number | "">("");
  const [showId, setShowId] = useState<number | "">("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [rate, setRate] = useState<number | "">("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [theatres, setTheatres] = useState<any[]>([]);
  const [shows, setShows] = useState<any[]>([]);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await axios.get(
          "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/theatres"
        );
        setTheatres(response.data);
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    };

    const fetchShows = async () => {
      try {
        const response = await axios.get(
          "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/shows"
        );
        setShows(response.data);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };

    fetchTheatres();
    fetchShows();
  }, []);

  const handleSeatToggle = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleSelectRow = (row: string) => {
    const rowSeats = Array.from(
      { length: 10 },
      (_, index) => `${row}${index + 1}`
    );

    // Check if all the seats in the row are already selected
    const allSeatsSelected = rowSeats.every((seat) =>
      selectedSeats.includes(seat)
    );

    // If all seats are selected, deselect them; otherwise, select them
    if (allSeatsSelected) {
      // Deselect the entire row
      setSelectedSeats((prev) =>
        prev.filter((seat) => !rowSeats.includes(seat))
      );
    } else {
      // Select the entire row
      setSelectedSeats((prev) => [
        ...prev,
        ...rowSeats.filter((seat) => !prev.includes(seat)),
      ]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      selectedSeats.length === 0 ||
      !theatreId ||
      !showId ||
      !category ||
      rate === ""
    ) {
      alert("All fields are required.");
      return;
    }

    const seatData = {
      theatreId,
      showId,
      seatDetails: selectedSeats.map((seatNumber) => ({
        seatNumber,
        category,
        rate,
      })),
    };

    try {
      const response = await axios.post(
        "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/add-seat",
        seatData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Seats added successfully!");
      setSelectedSeats([]);
      setCategory("");
      setRate("");
      setTheatreId("");
      setShowId("");
    } catch (error) {
      console.error("Error adding seats:", error);
    }
  };

  const generateSeats = () => {
    const rows = "ABCDEFGHIJKLMNOPQR"; // Reduced to 10 rows for simplicity
    const seatsPerRow = 10;
    return rows.split("").map((row) => (
      <div key={row} style={styles.row}>
        <button
          style={styles.selectRowButton}
          onClick={() => handleSelectRow(row)}
        >
          Select Row {row}
        </button>
        {Array.from({ length: seatsPerRow }, (_, index) => {
          const seatNumber = `${row}${index + 1}`;
          return (
            <button
              key={seatNumber}
              style={{
                ...styles.seatButton,
                backgroundColor: selectedSeats.includes(seatNumber)
                  ? "#E50914"
                  : "#444",
              }}
              onClick={() => handleSeatToggle(seatNumber)}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>
    ));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Seats</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          value={theatreId}
          onChange={(e) => setTheatreId(Number(e.target.value))}
          required
          style={styles.select}
        >
          <option value="">Select Theatre</option>
          {theatres.map((theatre) => (
            <option key={theatre.id} value={theatre.id}>
              {theatre.name}
            </option>
          ))}
        </select>
        <select
          value={showId}
          onChange={(e) => setShowId(Number(e.target.value))}
          required
          style={styles.select}
        >
          <option value="">Select Show</option>
          {shows.map((show) => (
            <option key={show.id} value={show.id}>
              {show.date} - {show.time} - {show.movie.title} -{" "}
              {show.theatre.name}
            </option>
          ))}
        </select>
        <div style={styles.seatLayout}>
          <div style={styles.seatScrollContainer}>{generateSeats()}</div>
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={styles.select}
        >
          <option value="">Select Category</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Platinum">Platinum</option>
        </select>
        <input
          type="number"
          placeholder="Rate"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          Add Seats
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
    maxWidth: "800px",
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
  seatLayout: {
    marginBottom: "20px",
  },
  seatScrollContainer: {
    maxWidth: "100%",
    maxHeight: "400px", // Set a fixed height for vertical scrolling
    overflowX: "auto", // Horizontal scrolling
    overflowY: "auto", // Vertical scrolling
    whiteSpace: "nowrap",
  },
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "5px 0",
    whiteSpace: "nowrap",
  },
  seatButton: {
    margin: "2px",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
    width: "35px",
    height: "35px",
  },
  selectRowButton: {
    marginRight: "10px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#555",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  select: {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #444",
    borderRadius: "5px",
    backgroundColor: "#222",
    color: "#ffffff",
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
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#E50914",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  successMessage: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#4BB543",
    color: "#ffffff",
  },
};

export default SeatAddComponent;
