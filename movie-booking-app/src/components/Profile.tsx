import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../Css/Profile.css";

interface BookedSeatDTO {
  bookingId: number;
  seatId: number;
  seatNumber: string;
  movieTitle: string;
  theatreName: string;
  showTime: string;
  status: string; // Used to check if the booking is cancelled
}

const Profile: React.FC<{ userId: number | null }> = ({ userId }) => {
  const [bookedSeats, setBookedSeats] = useState<BookedSeatDTO[]>([]);

  // Fetch booked seats when the component mounts or when userId changes
  useEffect(() => {
    if (userId) {
      axios
        .get(
          `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/user/${userId}/seats`
        )
        .then((response) => setBookedSeats(response.data))
        .catch((error) => console.error("Error fetching booked seats:", error));
    }
  }, [userId]);

  // Handle booking cancellation
  const handleCancel = (bookingId: number) => {
    const token = localStorage.getItem("authToken");
    console.log("Toeken to set authentication header: ", token);

    axios
      .put(
        `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/cancel/${bookingId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Booking cancelled successfully");
        setBookedSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.bookingId === bookingId
              ? { ...seat, status: "Cancelled" }
              : seat
          )
        );
      })
      .catch((error) => toast.error("Error cancelling booking"));
  };

  // Group bookings by bookingId
  const groupedBookings = bookedSeats.reduce(
    (acc, seat) => {
      acc[seat.bookingId] = acc[seat.bookingId] || [];
      acc[seat.bookingId].push(seat);
      return acc;
    },
    {} as Record<number, BookedSeatDTO[]>
  );

  return (
    <div className="container">
      <div className="header-container">
        <h2>Your booked seats</h2>
        <div className="divider-bar-v3" />
      </div>
      {bookedSeats.length === 0 ? (
        <p>No bookings available</p>
      ) : (
        Object.keys(groupedBookings).map((bookingId) => (
          <div
            key={bookingId}
            className={`booking-card ${
              groupedBookings[parseInt(bookingId)][0].status === "Cancelled"
                ? "cancelled-booking"
                : ""
            }`}
          >
            <div className="booking-header">
              <div>
                <h3>{groupedBookings[parseInt(bookingId)][0].movieTitle}</h3>
                <p>
                  <strong>Theatre:</strong>{" "}
                  {groupedBookings[parseInt(bookingId)][0].theatreName}
                </p>
                <p>
                  <strong>Show Time:</strong>{" "}
                  {groupedBookings[parseInt(bookingId)][0].showTime}
                </p>
              </div>
              <button
                className="cancel-button"
                onClick={() => handleCancel(parseInt(bookingId))}
                disabled={
                  groupedBookings[parseInt(bookingId)][0].status === "Cancelled"
                }
              >
                {groupedBookings[parseInt(bookingId)][0].status === "Cancelled"
                  ? "Booking Cancelled"
                  : "Cancel Booking"}
              </button>
            </div>
            <div className="booking-seats">
              <p>
                <strong>Seats:</strong>{" "}
                {groupedBookings[parseInt(bookingId)]
                  .map((seat) => seat.seatNumber)
                  .join(", ")}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
