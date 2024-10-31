import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/MoviesDetails.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faChair } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import StayPrimaryLandscapeOutlinedIcon from "@mui/icons-material/StayPrimaryLandscapeOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Container, Row, Col } from "react-bootstrap";
import DateSelector from "./DateSelector";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "./LoadingComponent";

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

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface BookedSeatResponse {
  status: string;
  seatNumbers: string[];
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shows, setShows] = useState<{ [theatre: string]: Show[] }>({});
  const [showTime, setShowTime] = useState<number | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const playerRef = useRef<any>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  let videoId = ""; // Global variable
  const [isApiReady, setIsApiReady] = useState(false);

  const navigate = useNavigate();

  const handlePayment = () => {
    // Pass necessary information (movie and show details) to the PaymentComponent
    console.log("Movie id from payment method - ", id);
    console.log("Show id from payment method - ", showTime);
    console.log("Seat API Response from Payment method", selectedSeats);
    console.log("Seats:", seats);
    console.log("Selected Seat IDs:", selectedSeats);

    navigate(`/movies/${id}/payment`, {
      state: {
        movie: movie,
        show: show,
        showid: showTime,
        seats: seats,
        selectedSeats: selectedSeats,
        selectedSeatNumbers: selectedSeatNumbers,
      },
    });
  };

  const togglePaymentModal = () => {
    setIsPaymentModalOpen(!isPaymentModalOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    document.body.classList.toggle("page-content-blur", !isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    if (isBooked) {
      const timer = setTimeout(() => {
        setIsBooked(false);
      }, 3000); // Reset after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isBooked]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/theatre-shows-by-movie/${id}`
        );
        setShows(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("There was an error fetching the movie details.");
        setLoading(false);
      }
    };
    const fetchMovieInfo = async () => {
      try {
        const response = await axios.get(
          `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/movies/${id}`
        );
        setMovie(response.data);
        console.log("Movie details - ", response.data);
      } catch (err) {
        console.error("Error fetching movie info:", err);
        setError("There was an error fetching the movie info.");
      }
    };

    fetchMovieDetails();
    fetchMovieInfo();
  }, [id]);

  const extractVideoIdFromUrl = (url: string): string => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v") || ""; // Extract the video ID from the URL
  };

  useEffect(() => {
    const initializePlayer = () => {
      console.log("Initializing player...");

      if (movie?.youtubeUrl) {
        videoId = extractVideoIdFromUrl(movie?.youtubeUrl);
        console.log("Video id: ", videoId);
      }

      if (window.YT && window.YT.Player) {
        console.log("Initializing player level 1...");

        if (playerRef.current) {
          console.log("In destroy field..", playerRef.current);

          playerRef.current.destroy();

          console.log("Initializing - Destroy...");
        }

        playerRef.current = new window.YT.Player("youtube-player", {
          videoId: videoId, // Correct YouTube video ID
          playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            fs: 0,
            disablekb: 1,
            loop: 1,
            playlist: videoId,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      } else {
        console.error("YT.Player is not available");
      }

      console.log(
        "Youtube.current initialized - playref ...",
        playerRef.current
      );
    };

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        console.log("Loading YouTube API script...");
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
        window.onYouTubeIframeAPIReady = initializePlayer;
      } else {
        console.log("YouTube API script already loaded");
        initializePlayer();
      }
    };

    const onPlayerReady = (event: any) => {
      event.target.playVideo();
      setIsPlaying(true);
    };

    const onPlayerStateChange = (event: any) => {
      console.log("Player state change:", event.data);
      if (event.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    loadYouTubeAPI();
    //initializePlayer();

    /* const handleScroll = () => {
      const iframe = document.getElementById("youtube-player");
      const iframeBounds = iframe?.getBoundingClientRect();
      const isVisible =
        iframeBounds &&
        iframeBounds.top >= 0 &&
        iframeBounds.left >= 0 &&
        iframeBounds.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        iframeBounds.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      if (playerRef.current) {
        if (isVisible) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (playerRef.current) {
        playerRef.current.destroy();
      } 
    }; */
  }, [id, movie, videoId, movie?.youtubeUrl]); // Re-run when `id` changes

  const handlePlayPause = () => {
    if (playerRef.current && playerRef.current.getPlayerState) {
      const playerState = playerRef.current.getPlayerState();

      console.log("Player Ref:", playerRef.current); // Log player reference

      if (playerState === window.YT.PlayerState.PLAYING) {
        console.log("Pausing video...");
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        console.log("Playing video...");
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else {
      console.error(
        "Player is not initialized or getPlayerState is not available"
      );
    }
  };

  useEffect(() => {
    const fetchBookedSeats = async () => {
      console.log("Booked seat numbers - Show ID...", showTime);
      try {
        const response = await axios.get<BookedSeatResponse[]>(
          `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/booked-seats-status/${showTime}`
        );
        // Assuming the response is an array and you need to handle each item
        const seatNumbers = response.data.flatMap((item) =>
          item.status === "Confirmed" ? item.seatNumbers : []
        );

        setBookedSeats(seatNumbers);
        console.log("Booked seat numbers...", seatNumbers);
      } catch (error) {
        console.error("Error fetching booked seats:", error);
      }
    };

    if (showTime !== null) {
      fetchBookedSeats();
    }
  }, [showTime]);

  const handleShowtimeClick = async (showId: number) => {
    console.log("Show Timing clicked...", showId);
    setShowTime(showId);
    setIsModalOpen(true);

    const allShows: Show[] = Object.values(shows).flat();
    const selectedShow = allShows.find((show) => show.id === showId) || null;
    setShow(selectedShow);

    if (playerRef.current && playerRef.current.getPlayerState) {
      const playerState = playerRef.current.getPlayerState();
      if (playerState === window.YT.PlayerState.PLAYING) {
        console.log("Pausing video...");
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      }
    }
    try {
      const response = await axios.get(
        `http://a96784accbed04d04a49101640f100a7-2048952236.ap-southeast-2.elb.amazonaws.com:8080/api/auth/show-seats/${showId}`
      );
      setSeats(response.data);

      console.log("Show id from API Param..", showId);
    } catch (error) {
      console.error("Error fetching seat data:", error);
    }
  };

  const toggleSeatSelection = (seatId: number) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatId)) {
        return prevSelectedSeats.filter((id) => id !== seatId);
      } else {
        return [...prevSelectedSeats, seatId];
      }
    });
  };

  const uniqueDates = Array.from(
    new Set(
      Object.values(shows)
        .flat()
        .map((show) => show.date)
    )
  );

  if (error) return <p>{error}</p>;

  if (!movie) return <LoadingComponent loading={loading} />;

  // Define a function to split seats into two columns
  const getSeatColumns = (allSeats: Seat[]) => {
    const left = allSeats.filter((_, index) => index % 2 === 0);
    const right = allSeats.filter((_, index) => index % 2 !== 0);
    return { left, right };
  };

  interface SeatButtonProps {
    selected: boolean;
    status: "available" | "booked";
  }

  interface Props {
    seat: Seat;
    bookedSeats: string[];
    toggleSeatSelection: (id: number) => void;
  }

  const isSeatDisabled = (seat: Seat) => {
    const seatNum = String(seat.seatNumber).trim();
    let isDisabled = false;

    for (const bookedSeat of bookedSeats) {
      const bookedSeatNumbers = bookedSeat.split(",").map((s) => s.trim());
      console.log("Seat disabled status:", seatNum, bookedSeatNumbers);

      if (bookedSeatNumbers.includes(seatNum)) {
        isDisabled = true;
        break; // Exit loop early if a match is found
      }
    }

    return isDisabled;
  };

  // Organize seats by rows
  const seatsByRow = seats.reduce(
    (acc, seat) => {
      const row = seat.seatNumber.charAt(0);
      if (!acc[row]) {
        acc[row] = [];
      }
      acc[row].push(seat);
      return acc;
    },
    {} as { [row: string]: Seat[] }
  );

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Invalid date";

    const date = new Date(dateString);

    // Ensure correct options for formatting
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Get the day and determine the ordinal suffix
    const day = date.getDate();
    const ordinalSuffix = (day: number): string => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${formattedDate}${ordinalSuffix(day)}`;
  };

  const formatTime = (timeString: string | undefined): string => {
    if (!timeString) return "Invalid time";

    const [hour, minute] = timeString.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert hour to 12-hour format
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // Add leading zero if needed

    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  const selectedSeatNumbers = selectedSeats
    .map((seatId: number) => {
      const seat = seats.find((seat: Seat) => seat.id === seatId);
      return seat ? seat.seatNumber : null;
    })
    .filter(Boolean);

  if (loading) {
    return <LoadingComponent loading={loading} />; // Use the loading component
  }

  return (
    <div className="movie-detail-con container">
      <div className="movie-info">
        <img src={`data:image/png;base64,${movie.image}`} alt={movie.title} />
        <div className="movie-text">
          <h2>{movie.title}</h2>
          <p>{movie.genre}</p>
          <Button
            className="btn btn-primary"
            variant="outlined"
            onClick={handlePlayPause}
            size="small"
            sx={{
              color: "#ff5722", // Custom text color
              borderColor: "#ff5722", // Custom border color
              "& .MuiTouchRipple-root": {
                color: "#F88379", // Custom ripple color
              },
              "&:hover": {
                borderColor: "#ff5722",
              },
              "&:active": {
                borderColor: "#ff5722",
              },
              "&:focus": {
                outline: "none", // Removes the default focus outline
              },
              "&:before": {
                backgroundColor: "transparent", // Prevents any default background color from showing
              },
              "&:after": {
                backgroundColor: "#ff5722", // Custom background color after ripple effect
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                opacity: 0.2, // Adjust this to make it more or less visible
                transition: "opacity 0.4s", // Makes the color fade away instead of an abrupt change
              },
            }}
          >
            {isPlaying ? (
              <>
                <PauseIcon sx={{ marginRight: "8px" }} /> Pause
              </>
            ) : (
              <>
                <PlayArrowIcon sx={{ marginRight: "8px" }} /> Play
              </>
            )}
          </Button>
        </div>
        <div className="background-video">
          <div id="youtube-player"></div>
        </div>
      </div>

      <div className="w3-theme-d3 dates-container">
        {/* {uniqueDates.map((date) => (
    <button
      key={date}
      onClick={() => setSelectedDate(date)}
      className={`m-2 date-button ${selectedDate === date ? "selected" : ""}`}
    >
      {date}
    </button>
  ))} */}
        <DateSelector dates={uniqueDates} onDateSelect={setSelectedDate} />
      </div>

      <div className="theatre-container">
        {Object.entries(shows).map(([theatre, shows]) => (
          <div key={theatre} className="theatre-shows">
            <div className="theatre-info">
              <h3>{shows[0]?.theatre.name}</h3>
              <span className="theatre-location">
                <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                {shows[0]?.theatre.location}
              </span>
            </div>
            <div className="show-times">
              {shows
                .filter((show) => show.date === selectedDate)
                .map((show) => (
                  <Button
                    key={show.id}
                    onClick={() => handleShowtimeClick(show.id)}
                    variant="outlined"
                    color="success"
                    size="medium"
                  >
                    {show.time}
                  </Button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Selection Component */}
      <div
        className={`seat-selection-modal ${isModalOpen ? "show-modal" : ""}`}
      >
        <div className="seat-selection-content">
          <div className="container seat-selector">
            {seats.length > 0 && (
              <div className="seat-map">
                <div className="seat-map-header">
                  <IconButton
                    onClick={handleCloseModal}
                    className="close-button"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      color: "GrayText",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="show-time-info">
                    <div className="show-date-in-ticket-screen">
                      Show Time:{" "}
                      {selectedDate
                        ? formatDate(selectedDate)
                        : "Date not selected"}
                    </div>
                    {showTime !== null &&
                    Object.values(shows)
                      .flat()
                      .find((show) => show.id === showTime) ? (
                      <div className="show-time-details">
                        <span className="theatre-name">
                          Theatre:{" "}
                          {
                            Object.values(shows)
                              .flat()
                              .find((show) => show.id === showTime)?.theatre
                              .name
                          }
                        </span>
                        <span className="show-time-in-ticket-info">
                          Time:{" "}
                          {formatTime(
                            Object.values(shows)
                              .flat()
                              .find((show) => show.id === showTime)?.time
                          )}
                        </span>
                      </div>
                    ) : (
                      " Showtime not selected"
                    )}
                  </p>
                </div>

                <div className="color-code-legend">
                  <div className="color-box selected"></div>
                  <span className="color-box-label-text">Selected</span>
                  <div className="color-box booked"></div>
                  <span className="color-box-label-text">Booked</span>
                  <div className="color-box available"></div>
                  <span className="color-box-label-text">Available</span>
                </div>

                {Object.keys(seatsByRow)
                  .sort()
                  .map(
                    (row) =>
                      seatsByRow[row].length > 0 && (
                        <div key={row} className="seat-row">
                          <div className="row-label">{row}</div>
                          <div className="seat-spacer-rowLabel"></div>
                          <div className="seats">
                            {seatsByRow[row].map((seat, index) => (
                              <>
                                <Box
                                  // key={seat.id}
                                  // selected={selectedSeats.includes(seat.id)}
                                  // status={seat.status}
                                  //onClick={() => toggleSeatSelection(seat.id)}
                                  style={{
                                    padding: "2px",
                                    margin: "1px",
                                  }}
                                >
                                  <Fab
                                    onClick={() => toggleSeatSelection(seat.id)}
                                    style={{
                                      backgroundColor: selectedSeats.includes(
                                        seat.id
                                      )
                                        ? "rgba(0, 218, 18, 0.5)"
                                        : seat.status === "booked" ||
                                            isSeatDisabled(seat)
                                          ? "#383838"
                                          : "rgba(150,150, 150, 0.5)",
                                      color:
                                        seat.status === "booked" ||
                                        isSeatDisabled(seat)
                                          ? "#ccc"
                                          : "#F8F8F8",
                                      width: "34px",
                                      height: "20px",
                                      border: isSeatDisabled(seat)
                                        ? "1px solid #404040"
                                        : "1px solid #404040",
                                      boxShadow:
                                        "5px 1px 5px rgba(0, 0, 0, 0.1)",
                                      cursor: isSeatDisabled(seat)
                                        ? "not-allowed"
                                        : "pointer",
                                      opacity: isSeatDisabled(seat) ? 0.6 : 1,
                                    }}
                                    disabled={isSeatDisabled(seat)}
                                  >
                                    <div
                                      className={`seat-number ${selectedSeats.includes(seat.id) ? "selected" : ""}`}
                                      style={{
                                        color: isSeatDisabled(seat)
                                          ? "grey"
                                          : "inherit",
                                      }}
                                    >
                                      {seat.seatNumber}
                                    </div>
                                    {/* </div> */}
                                  </Fab>
                                </Box>
                                {index ===
                                  Math.floor(seatsByRow[row].length / 2) -
                                    1 && <div className="seat-spacer"></div>}
                              </>
                            ))}
                          </div>
                        </div>
                      )
                  )}

                <div className="parent-container">
                  <div className="seats">
                    {/* Your seats div content here */}
                  </div>
                  <div className="theatre-screen-icon">
                    <h2>Screen 1</h2>
                    <p>
                      Enjoy our latest movies in stunning clarity and immersive
                      sound.
                    </p>
                    <p className="screen-details">
                      Dolby Atmos | Recliner Seats | 4K Projection
                    </p>
                  </div>
                </div>
                <div className="book-tickets-container">
                  <div className="book-tickets-btn" onClick={handlePayment}>
                    {/*<button
                    className={`book-tickets-btn ${isBooked ? "booked" : ""}`}
                    onClick={handleBookTickets}
                  >
                    Book Tickets
                  </button> */}
                    <span>Book Tickets</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
