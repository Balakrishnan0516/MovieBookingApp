import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "../Css/LoadingAnimation.css"; // You can add specific styling here
import styled from "@emotion/styled";

const LoadingAnimation: React.FC = () => {
  const PulseCircularProgress = styled(CircularProgress)({
    animation: "pulse 1.5s infinite",
    color: "#ff4081", // Custom color (pink)
    "@keyframes pulse": {
      "0%": {
        transform: "scale(1)",
      },
      "50%": {
        transform: "scale(1.2)",
      },
      "100%": {
        transform: "scale(1)",
      },
    },
  });

  return (
    <div className="loading-animation">
      <div className="loading-spinner">
        <PulseCircularProgress style={{ color: "#ff2525" }} size={60} />{" "}
        {/* You can adjust size */}
        <p>Processing Payment...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
