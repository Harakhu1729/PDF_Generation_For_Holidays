import { useState } from "react";
import HolidayBookingForm from "./HolidayBookingForm";
import BookingsDashboard from "./BookingsDashboard";

function App() {
  const [page, setPage] = useState("form");

  return (
    <div style={{ fontFamily: "sans-serif" }}>

      {/* Navigation */}
      <div style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid #e0e0e0",
        padding: "0 1.5rem",
        background: "#fafafa"
      }}>
        <button
          onClick={() => setPage("form")}
          style={{
            padding: "12px 20px",
            fontSize: 13,
            fontWeight: page === "form" ? 600 : 400,
            cursor: "pointer",
            border: "none",
            borderBottom: page === "form" ? "2px solid #333" : "2px solid transparent",
            background: "none",
            color: page === "form" ? "#111" : "#666",
          }}
        >
          New Query
        </button>
        <button
          onClick={() => setPage("dashboard")}
          style={{
            padding: "12px 20px",
            fontSize: 13,
            fontWeight: page === "dashboard" ? 600 : 400,
            cursor: "pointer",
            border: "none",
            borderBottom: page === "dashboard" ? "2px solid #333" : "2px solid transparent",
            background: "none",
            color: page === "dashboard" ? "#111" : "#666",
          }}
        >
          All Queries
        </button>
      </div>

      {/* Page content */}
      {page === "form" && <HolidayBookingForm />}
      {page === "dashboard" && <BookingsDashboard />}

    </div>
  );
}

export default App;