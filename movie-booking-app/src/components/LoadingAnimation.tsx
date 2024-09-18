import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "../Css/LoadingAnimation.css"; // You can add specific styling here

const LoadingAnimation: React.FC = () => {
  return (
    <div className="loading-animation">
      <div className="loading-spinner">
        <CircularProgress color="primary" size={60} />{" "}
        {/* You can adjust size */}
        <p>Processing Payment...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
