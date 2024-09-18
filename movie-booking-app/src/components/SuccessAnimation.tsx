// SuccessAnimation.tsx
import React from "react";
import "../Css/SuccessAnimation.css"; // Add styles for the animation

const SuccessAnimation: React.FC = () => {
  return (
    <div className="success-animation-container">
      <div className="success-checkmark">
        <div className="check-icon">
          <span className="icon-line line-tip"></span>
          <span className="icon-line line-long"></span>
          <div className="icon-circle"></div>
          <div className="icon-fix"></div>
        </div>
      </div>
      <h2>Payment Successful!</h2>
    </div>
  );
};

export default SuccessAnimation;
