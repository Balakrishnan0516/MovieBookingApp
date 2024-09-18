import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import "../Css/DateSelector.css";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
  color: "#FFFFFF", // Custom text color
  borderColor: "#ff5722", // Custom border color
  position: "relative",
  zIndex: 1,
  backgroundColor: "transparent",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",

  "&:hover": {
    transform: "scale(1.05)", // Slightly enlarge the button on hover
    boxShadow: "0 0 10px #FFFFFF", // Add a glowing effect on hover
    zIndex: 2,
  },
  "&:focus": {
    outline: "none", // Removes the default focus outline
  },
  "&:before": {
    backgroundColor: "transparent", // Prevents any default background color from showing
  },
  "&:after": {
    backgroundColor: "#FFFFFF", // Custom background color after ripple effect
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.2, // Adjust this to make it more or less visible
    transition: "opacity 0.4s", // Makes the color fade away instead of an abrupt change
  },
});

interface DateSelectorProps {
  dates: string[];
  onDateSelect: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ dates, onDateSelect }) => {
  // Set the first date as the default selected date
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  // Extract month from the first date
  const firstDate = new Date(dates[0]);
  const month = firstDate.toLocaleString("default", { month: "short" });

  return (
    <Container
      style={{
        padding: "1rem 0.2rem",
      }}
    >
      <Row>
        <Col>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="month-box">{month}</div>
            <div className="divider-bar" />
            <div style={{ display: "flex", gap: "0.1rem" }}>
              {dates.map((date) => {
                const day = new Date(date).getDate();
                return (
                  <StyledButton
                    key={date}
                    onClick={() => handleDateClick(date)}
                    disableFocusRipple
                    className={selectedDate === date ? "selected" : ""}
                  >
                    {day}
                  </StyledButton>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DateSelector;
