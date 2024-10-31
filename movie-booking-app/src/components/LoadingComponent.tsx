import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "../Css/LoadingComponent.css";

// Define the type for the props
interface LoadingComponentProps {
  loading: boolean;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ loading }) => {
  return (
    <div className="loading-container">
      <ClipLoader color={"#ff2525"} loading={loading} size={60} />
    </div>
  );
};

export default LoadingComponent;
