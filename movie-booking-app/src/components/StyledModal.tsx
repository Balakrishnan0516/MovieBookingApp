import React from "react";
import "./StyledModal.css";

interface StyledModalProps {
  message: string;
  onClose: () => void;
}

const StyledModal: React.FC<StyledModalProps> = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default StyledModal;
