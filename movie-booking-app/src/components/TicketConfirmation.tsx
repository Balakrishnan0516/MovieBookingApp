import React from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import "../Css/TicketConfirmation.css";

interface TicketDetailsProps {
  movieTitle: string;
  theatreName: string;
  location: string;
  selectedSeats: string[];
  totalAmount: number;
  showDate: string;
  showTime: string;
  bookingId: string;
  moviePoster: string; // New property for movie poster image URL
}

const TicketConfirmation: React.FC = () => {
  const location = useLocation();
  const { movie, show, selectedSeats, totalAmount, bookingId } =
    location.state || {};

  const downloadPDF = () => {
    const input = document.getElementById("ticket-details");

    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
        pdf.save("ticket-details.pdf");
      });
    }
  };

  if (!movie || !show || !selectedSeats) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ticket-confirmation-container">
      <div id="ticket-details" className="ticket-details-box">
        <h2 className="ticket-title">Booking Confirmation</h2>

        {/* Flex container for image and ticket details */}
        <div className="ticket-content">
          {/* Movie Poster */}
          <div className="ticket-image">
            <img
              src={`data:image/png;base64,${movie.image}`}
              alt={movie.title}
              className="movie-image"
            />
          </div>

          <div className="divider-bar-v2" />

          {/* Ticket Details */}
          <div className="ticket-info">
            <p>
              <strong>Movie:</strong> {movie.title}
            </p>
            <p>
              <strong>Theatre:</strong> {show.theatre.name}
            </p>
            <p>
              <strong>Location:</strong> {show.theatre.location}
            </p>
            <p>
              <strong>Seats:</strong> {selectedSeats.join(", ")}
            </p>
            <p>
              <strong>Date:</strong> {show.date}
            </p>
            <p>
              <strong>Time:</strong> {show.time}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{totalAmount}
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        <div
          className="qr-code-container"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <QRCodeCanvas value={bookingId || "sample-booking-id"} size={128} />
          <p>Scan for Ticket Details</p>
        </div>
      </div>

      <button className="download-button" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default TicketConfirmation;
