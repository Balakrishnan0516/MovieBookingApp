import React, { useEffect, useState } from "react";
import "../Css/PaymentComponent.css";
import Button from "@mui/material/Button";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import DateSelector from "./DateSelector";
import SuccessAnimation from "./SuccessAnimation";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingAnimation from "./LoadingAnimation";
import { toast } from "react-toastify";

interface Show {
  id: number;
  movie: Movie;
  theatre: Theatre;
  date: string;
  time: string;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  director: string;
  synopsis: string;
  image: string;
  youtubeUrl: string;
}

interface Theatre {
  id: number;
  name: string;
  location: string;
}

interface Seat {
  id: number;
  seatNumber: string;
  status: "available" | "booked";
}

interface PaymentComponentProps {
  userId: number | null;
}

interface PaymentData {
  userId: number;
  showId: number;
  selectedSeats: string[];
  totalAmount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ userId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [hasToastBeenShown, setHasToastBeenShown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { movie, show, seats = [], selectedSeats } = location.state || {};

  useEffect(() => {
    if (userId === 0 || userId === null) {
      if (!hasToastBeenShown) {
        toast.info("Please log in to continue with payment.");
        setHasToastBeenShown(true);
      }
      navigate("/login"); // Redirect to login page
    }
  }, [userId, navigate, hasToastBeenShown]);

  const selectedSeatNumbers = Array.isArray(selectedSeats)
    ? selectedSeats
        .map((seatId: number) => {
          const seat = seats.find((seat: Seat) => seat.id === seatId);
          return seat ? seat.seatNumber : null;
        })
        .filter(Boolean)
    : [];

  useEffect(() => {
    const fetchTotalAmount = async () => {
      if (selectedSeatNumbers.length === 0) {
        setTotalAmount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/seats-totalRate/${show.id}`,
          selectedSeatNumbers
        );
        setTotalAmount(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch total amount");
        setLoading(false);
      } finally {
        setLoading(false); // Re-enable the button
      }
    };

    fetchTotalAmount();
  }, []);

  const validateForm = (): boolean => {
    if (!cardNumber || cardNumber.length < 16) {
      alert("Please enter a valid 16-digit card number.");
      return false;
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      alert("Please enter a valid expiry date in the format MM/YY.");
      return false;
    }
    if (!cvv || cvv.length !== 3) {
      alert("Please enter a valid 3-digit CVV.");
      return false;
    }
    return true;
  };

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    setIsPaymentProcessing(true);

    const cardNumber = (
      event.currentTarget.elements.namedItem("cardNumber") as HTMLInputElement
    ).value;
    const expiryDate = (
      event.currentTarget.elements.namedItem("expiryDate") as HTMLInputElement
    ).value;
    const cvv = (
      event.currentTarget.elements.namedItem("cvv") as HTMLInputElement
    ).value;

    const paymentData: PaymentData = {
      userId: userId || 0, // Replace with actual userId
      showId: show?.id || 0, // Replace with actual showId
      selectedSeats: selectedSeatNumbers,
      totalAmount: totalAmount,
      cardNumber: cardNumber,
      expiryDate: expiryDate,
      cvv: cvv,
    };
    console.log("seats data:", selectedSeatNumbers);
    console.log("Payment data:", JSON.stringify(paymentData));

    try {
      const response = await fetch(
        "http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/complete-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (response.ok) {
        const result = await response.text();
        console.log(result);
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate("/confirmation", {
            state: {
              movie,
              show,
              selectedSeats: selectedSeatNumbers,
              totalAmount,
            },
          }); // Navigate to the confirmation page after the animation
        }, 5000);
      } else {
        console.error("Payment failed.");
        alert("Payment failed. Please try again.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        if (error.response.data.message === "Seat already booked") {
          alert(
            "The selected seat is already booked. Please choose another seat."
          );
        } else {
          alert("Error: Forbidden. Please try again or log in.");
        }
      } else {
        alert("An error occurred during payment. Please try again.");
      }

      console.error("Payment failed.");
      alert("Payment failed. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const formattedTime = show ? formatTime(show.time) : "";

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (paymentSuccess) {
    return <SuccessAnimation />;
  }

  return (
    <div>
      {isPaymentProcessing && (
        <div>
          <LoadingAnimation /> {/* Full-screen loading animation */}
        </div>
      )}

      <div className="container payment-container">
        <div className="payment-left">
          <div className="ticket-container">
            <img
              src={`data:image/png;base64,${movie.image}`}
              alt={movie.title}
              className="movie-image"
            />
            <div className="movie-details">
              <h2 className="movie-title">{movie.title}</h2>
              <p>Date: {show.date}</p>
              <div className="time-container">
                <span className="time-label">Time:</span>
                <div className="divider-bar" />
                <span className="time-value">{formattedTime}</span>
              </div>
              <p>Selected Seats: {selectedSeatNumbers.join(", ")}</p>
              <div className="amount-to-pay">
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress color="primary" /> {/* Display spinner */}
                  </div>
                ) : (
                  <p>Total Amount: {formatCurrency(totalAmount)}</p>
                )}
                {error && <p className="error-message">{error}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="payment-right">
          <div className="payment-card glass-effect">
            <h2 className="payment-title">Payment Details</h2>
            <form className="payment-form" onSubmit={handlePayment}>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9123 4567"
                />
              </div>
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input type="text" id="expiryDate" placeholder="MM/YY" />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" placeholder="123" />
              </div>
              <div className="book-tickets-btn">
                <button
                  type="submit"
                  className="unstyled-button"
                  disabled={loading}
                >
                  Pay Now
                </button>
              </div>
            </form>
            <Button
              onClick={() => window.history.back()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                backgroundColor: "transparent",
                padding: "20px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                color: isHovered ? "#ff5722" : "white",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.2s, color 0.2s",
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
