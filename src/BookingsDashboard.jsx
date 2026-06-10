import { useState, useEffect } from "react";

const POLL_INTERVAL = 30000; // auto-refresh every 30 seconds

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/bookings");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setBookings(data);
      setError(null);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      setError("Could not load bookings. Check that FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount + auto-refresh every 30 seconds
  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Count today's bookings
  const today = new Date().toISOString().split("T")[0];
  const todayCount = bookings.filter(
    (b) => b.date_of_departure === today
  ).length;

  if (loading) return (
    <div style={{ padding: "2rem", fontSize: 14 }}>Loading bookings...</div>
  );

  if (error) return (
    <div style={{ padding: "2rem", fontSize: 14, color: "red" }}>{error}</div>
  );

  return (
    <div style={{ padding: "2rem 1.5rem", fontSize: 14 }}>

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>All Queries</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>
            Last refreshed: {lastRefreshed} · Auto-refreshes every 30 seconds
          </p>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* Summary counts */}
          <div style={{ textAlign: "center", padding: "8px 16px", border: "1px solid #e0e0e0", borderRadius: 6 }}>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{bookings.length}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Total queries</div>
          </div>
          <div style={{ textAlign: "center", padding: "8px 16px", border: "1px solid #e0e0e0", borderRadius: 6 }}>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{todayCount}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Departing today</div>
          </div>
          <button
            onClick={fetchBookings}
            style={{ padding: "8px 16px", fontSize: 13, cursor: "pointer", borderRadius: 4, border: "1px solid #ccc", background: "#fff" }}
          >
            Refresh now
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p style={{ color: "#888" }}>No queries submitted yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
                {[
                  "ID",
                  "Departure date",
                  "Passengers",
                  "Departure city",
                  "Places to cover",
                  "Activities",
                  "Transfer",
                  "Accommodation",
                  "VISA",
                  "Insurance",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid #e0e0e0",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      fontSize: 12,
                      color: "#444",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr
                  key={b.id}
                  style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                >
                  <td style={cell}>{b.id}</td>
                  <td style={cell}>{b.date_of_departure ?? "—"}</td>
                  <td style={cell}>{b.number_of_pax ?? "—"}</td>
                  <td style={cell}>{b.departure_city ?? "—"}</td>
                  <td style={cell}>
                    {b.places_to_cover?.length
                      ? b.places_to_cover.join(", ")
                      : "—"}
                  </td>
                  <td style={cell}>
                    {b.activities?.length
                      ? b.activities.join(", ")
                      : "—"}
                  </td>
                  <td style={cell}>{b.mode_of_transfer ?? "—"}</td>
                  <td style={cell}>{b.accommodation ?? "—"}</td>
                  <td style={cell}>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontSize: 11,
                      background: b.visa_included === "true" ? "#e6f4ea" : "#fce8e8",
                      color: b.visa_included === "true" ? "#2d7a3a" : "#c0392b",
                    }}>
                      {b.visa_included === "true" ? "Yes" : "No"}
                    </span>
                  </td>
                  <td style={cell}>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontSize: 11,
                      background: b.travel_insurance_included === "true" ? "#e6f4ea" : "#fce8e8",
                      color: b.travel_insurance_included === "true" ? "#2d7a3a" : "#c0392b",
                    }}>
                      {b.travel_insurance_included === "true" ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const cell = {
  padding: "10px 12px",
  borderBottom: "1px solid #f0f0f0",
  verticalAlign: "top",
  maxWidth: 200,
};