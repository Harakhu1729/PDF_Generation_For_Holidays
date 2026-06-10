import { useState } from "react";

const PLACES = [
  "Bali, Indonesia",
  "Bangkok, Thailand",
  "Phuket, Thailand",
  "Chiang Mai, Thailand",
  "Singapore",
  "Kuala Lumpur, Malaysia",
  "Langkawi, Malaysia",
  "Ho Chi Minh City, Vietnam",
  "Hanoi, Vietnam",
  "Ha Long Bay, Vietnam",
  "Siem Reap (Angkor Wat), Cambodia",
  "Phnom Penh, Cambodia",
  "Boracay, Philippines",
  "Palawan, Philippines",
  "Bagan, Myanmar",
  "Inle Lake, Myanmar",
  "Luang Prabang, Laos",
];

const PRESET_ACTIVITIES = [
  "Snorkeling",
  "Scuba Diving",
  "Island Hopping",
  "Temple Visit",
  "City Tour",
  "Cooking Class",
  "Jungle Trek",
  "Safari",
  "Beach Relaxation",
  "Cultural Show",
  "Night Market Visit",
  "River Cruise",
  "Ziplining",
  "Cycling Tour",
  "Elephant Sanctuary Visit",
  "Spa and Wellness",
];

const AIRPORTS = [
  { group: "India", options: [
    "Indira Gandhi International Airport (DEL) — New Delhi",
    "Chhatrapati Shivaji Maharaj International Airport (BOM) — Mumbai",
    "Kempegowda International Airport (BLR) — Bengaluru",
    "Chennai International Airport (MAA) — Chennai",
    "Netaji Subhas Chandra Bose International Airport (CCU) — Kolkata",
    "Rajiv Gandhi International Airport (HYD) — Hyderabad",
    "Cochin International Airport (COK) — Kochi",
    "Sardar Vallabhbhai Patel International Airport (AMD) — Ahmedabad",
    "Pune Airport (PNQ) — Pune",
    "Lokpriya Gopinath Bordoloi International Airport (GAU) — Guwahati",
  ]},
  { group: "Middle East", options: [
    "Dubai International Airport (DXB) — Dubai",
    "Abu Dhabi International Airport (AUH) — Abu Dhabi",
    "Hamad International Airport (DOH) — Doha",
    "King Abdulaziz International Airport (JED) — Jeddah",
    "Kuwait International Airport (KWI) — Kuwait City",
    "Muscat International Airport (MCT) — Muscat",
  ]},
  { group: "South-East Asia", options: [
    "Suvarnabhumi Airport (BKK) — Bangkok",
    "Singapore Changi Airport (SIN) — Singapore",
    "Kuala Lumpur International Airport (KUL) — Kuala Lumpur",
    "Ninoy Aquino International Airport (MNL) — Manila",
    "Nguyen Tat Thanh International Airport (SGN) — Ho Chi Minh City",
    "Noi Bai International Airport (HAN) — Hanoi",
    "Bali Ngurah Rai International Airport (DPS) — Bali",
    "Yangon International Airport (RGN) — Yangon",
  ]},
  { group: "Europe", options: [
    "Heathrow Airport (LHR) — London",
    "Charles de Gaulle Airport (CDG) — Paris",
    "Frankfurt Airport (FRA) — Frankfurt",
    "Amsterdam Airport Schiphol (AMS) — Amsterdam",
    "Leonardo da Vinci International Airport (FCO) — Rome",
    "Barcelona El Prat Airport (BCN) — Barcelona",
    "Zurich Airport (ZRH) — Zurich",
  ]},
  { group: "Americas", options: [
    "John F. Kennedy International Airport (JFK) — New York",
    "Los Angeles International Airport (LAX) — Los Angeles",
    "O'Hare International Airport (ORD) — Chicago",
    "Toronto Pearson International Airport (YYZ) — Toronto",
    "São Paulo Guarulhos International Airport (GRU) — São Paulo",
  ]},
  { group: "East Asia / Oceania", options: [
    "Narita International Airport (NRT) — Tokyo",
    "Incheon International Airport (ICN) — Seoul",
    "Beijing Capital International Airport (PEK) — Beijing",
    "Hong Kong International Airport (HKG) — Hong Kong",
    "Sydney Kingsford Smith Airport (SYD) — Sydney",
    "Auckland Airport (AKL) — Auckland",
  ]},
];

const ACCOMMODATION_OPTIONS = [
  "Hotel",
  "Resort",
  "Villa",
  "Serviced Apartment",
  "Homestay / Airbnb",
  "Other",
];

const initialState = {
  dateOfDeparture: "",
  numberOfPax: "",
  departureCity: "",
  placesToCover: [],
  selectedActivities: [],
  customActivityInput: "",
  customActivities: [],
  modeOfTransfer: "",
  accommodationDropdown: "",
  accommodationText: "",
  visa: null,
  travelInsurance: null,
};

export default function HolidayBookingForm() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  // --- Field handlers ---

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const togglePlace = (place) => {
    setForm((prev) => {
      const exists = prev.placesToCover.includes(place);
      return {
        ...prev,
        placesToCover: exists
          ? prev.placesToCover.filter((p) => p !== place)
          : [...prev.placesToCover, place],
      };
    });
  };

  const toggleActivity = (activity) => {
    setForm((prev) => {
      const exists = prev.selectedActivities.includes(activity);
      return {
        ...prev,
        selectedActivities: exists
          ? prev.selectedActivities.filter((a) => a !== activity)
          : [...prev.selectedActivities, activity],
      };
    });
  };

  const addCustomActivity = () => {
    const val = form.customActivityInput.trim();
    if (!val) return;
    setForm((prev) => ({
      ...prev,
      customActivities: [...prev.customActivities, val],
      customActivityInput: "",
    }));
  };

  const removeCustomActivity = (idx) => {
    setForm((prev) => ({
      ...prev,
      customActivities: prev.customActivities.filter((_, i) => i !== idx),
    }));
  };

  const handleAccommodationDropdown = (val) => {
    setForm((prev) => ({
      ...prev,
      accommodationDropdown: val,
      accommodationText: val === "Other" ? "" : val,
    }));
  };

  // --- Validation ---

  const validate = () => {
    const newErrors = {};

    if (!form.dateOfDeparture)
      newErrors.dateOfDeparture = "Date of departure is required.";

    if (!form.numberOfPax)
      newErrors.numberOfPax = "Number of passengers is required.";

    if (form.numberOfPax === "7+")
      newErrors.numberOfPax = "7+ passengers must use Group Booking.";

    if (!form.departureCity)
      newErrors.departureCity = "Departure city is required.";

    if (form.placesToCover.length === 0)
      newErrors.placesToCover = "Select at least one place to cover.";

    if (form.selectedActivities.length === 0 && form.customActivities.length === 0)
      newErrors.activities = "Add or select at least one activity.";

    if (!form.modeOfTransfer)
      newErrors.modeOfTransfer = "Mode of transfer is required.";

    if (!form.accommodationText)
      newErrors.accommodationText = "Accommodation is required.";

    if (!form.visa)
      newErrors.visa = "Please select a VISA preference.";

    if (!form.travelInsurance)
      newErrors.travelInsurance = "Please select a travel insurance preference.";

    return newErrors;
  };

  // --- Submit / Reset ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const payload = {
      date_of_departure:         form.dateOfDeparture || null,
      number_of_pax:             form.numberOfPax || null,
      departure_city:            form.departureCity || null,
      places_to_cover:           form.placesToCover,
      activities:                [...form.selectedActivities, ...form.customActivities],
      mode_of_transfer:          form.modeOfTransfer || null,
      accommodation:             form.accommodationText || null,
      visa_included:             form.visa,
      travel_insurance_included: form.travelInsurance,
    };

    try {
      const res = await fetch("http://localhost:8000/api/booking-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setFormData(data);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Something went wrong. Check that FastAPI is running.");
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setSubmitted(false);
    setFormData(null);
    setErrors({});
  };

  const isGroupBooking = form.numberOfPax === "7+";

  return (
    <div style={{ maxWidth: 720, padding: "2rem 1rem", fontFamily: "sans-serif", fontSize: 14 }}>
      <h2 style={{ marginBottom: "0.25rem" }}>Holiday Booking — Customer Query Form</h2>
      <p style={{ color: "#666", marginBottom: "2rem", fontSize: 12 }}>
        Internal use only — Holidays vertical
      </p>

      <form onSubmit={handleSubmit}>

        {/* 1. Date of Departure */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="departure-date" style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            1. Date of departure
          </label>
          <input
            type="date"
            id="departure-date"
            value={form.dateOfDeparture}
            onChange={(e) => handleChange("dateOfDeparture", e.target.value)}
            style={{ padding: "6px 10px", fontSize: 14, width: 220 }}
          />
          {errors.dateOfDeparture && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.dateOfDeparture}</p>
          )}
        </div>

        {/* 2. Number of Pax */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="num-pax" style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            2. Number of passengers
          </label>
          <select
            id="num-pax"
            value={form.numberOfPax}
            onChange={(e) => handleChange("numberOfPax", e.target.value)}
            style={{ padding: "6px 10px", fontSize: 14, width: 180 }}
          >
            <option value="">— Select —</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
            <option value="7+">7 or more</option>
          </select>
          {errors.numberOfPax && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.numberOfPax}</p>
          )}
          {isGroupBooking && (
            <p style={{ color: "red", marginTop: 6, fontWeight: 500 }}>
              7+ passengers — please opt for Group Booking.
            </p>
          )}
        </div>

        {/* 3. Departure City */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="departure-city" style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            3. Departure city / airport
          </label>
          <select
            id="departure-city"
            value={form.departureCity}
            onChange={(e) => handleChange("departureCity", e.target.value)}
            style={{ padding: "6px 10px", fontSize: 14, width: "100%", maxWidth: 520 }}
          >
            <option value="">— Select airport —</option>
            {AIRPORTS.map(({ group, options }) => (
              <optgroup key={group} label={group}>
                {options.map((airport) => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.departureCity && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.departureCity}</p>
          )}
        </div>

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 4. Places to Cover */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>
            4. Places to be covered (select all that apply)
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
            {PLACES.map((place) => (
              <label key={place} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={form.placesToCover.includes(place)}
                  onChange={() => togglePlace(place)}
                />
                {place}
              </label>
            ))}
          </div>
          {errors.placesToCover && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.placesToCover}</p>
          )}
        </div>

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 5. Activities */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>
            5. Activities at the location
          </label>

          {/* Custom input */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Type a custom activity..."
              value={form.customActivityInput}
              onChange={(e) => handleChange("customActivityInput", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomActivity())}
              style={{ padding: "6px 10px", fontSize: 13, flex: 1, maxWidth: 360 }}
            />
            <button type="button" onClick={addCustomActivity} style={{ padding: "6px 14px", fontSize: 13 }}>
              Add
            </button>
          </div>

          {/* Custom activity tags */}
          {form.customActivities.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {form.customActivities.map((a, i) => (
                <span
                  key={i}
                  style={{ padding: "3px 10px", background: "#e6f4ea", border: "1px solid #a8d5b5", borderRadius: 20, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => removeCustomActivity(i)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}
                    aria-label={`Remove ${a}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Preset activity checkboxes */}
          <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Or select from preset options:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 16px" }}>
            {PRESET_ACTIVITIES.map((activity) => (
              <label key={activity} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={form.selectedActivities.includes(activity)}
                  onChange={() => toggleActivity(activity)}
                />
                {activity}
              </label>
            ))}
          </div>
          {errors.activities && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.activities}</p>
          )}
        </div>

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 6. Mode of Transfer */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="transfer-mode" style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            6. Mode of transfer
          </label>
          <select
            id="transfer-mode"
            value={form.modeOfTransfer}
            onChange={(e) => handleChange("modeOfTransfer", e.target.value)}
            style={{ padding: "6px 10px", fontSize: 14, width: 200 }}
          >
            <option value="">— Select —</option>
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
          </select>
          {errors.modeOfTransfer && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.modeOfTransfer}</p>
          )}
          <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Options will be updated with actual transfer types.</p>
        </div>

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 7. Accommodation */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            7. Accommodation
          </label>
          <select
            value={form.accommodationDropdown}
            onChange={(e) => handleAccommodationDropdown(e.target.value)}
            style={{ padding: "6px 10px", fontSize: 14, width: 260, marginBottom: 8, display: "block" }}
          >
            <option value="">— Select a type —</option>
            {ACCOMMODATION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or type accommodation details directly..."
            value={form.accommodationText}
            onChange={(e) => handleChange("accommodationText", e.target.value)}
            style={{ padding: "6px 10px", fontSize: 13, width: "100%", maxWidth: 420 }}
          />
          {errors.accommodationText && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.accommodationText}</p>
          )}
        </div>

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 8 & 9. VISA + Travel Insurance */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>8. VISA</label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
              <input
                type="radio"
                name="visa"
                value="true"
                checked={form.visa === "true"}
                onChange={() => handleChange("visa", "true")}
              />
              Include VISA
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="radio"
                name="visa"
                value="false"
                checked={form.visa === "false"}
                onChange={() => handleChange("visa", "false")}
              />
              Do not include VISA
            </label>
            {errors.visa && (
              <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.visa}</p>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>9. Travel insurance</label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
              <input
                type="radio"
                name="insurance"
                value="true"
                checked={form.travelInsurance === "true"}
                onChange={() => handleChange("travelInsurance", "true")}
              />
              Include travel insurance
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="radio"
                name="insurance"
                value="false"
                checked={form.travelInsurance === "false"}
                onChange={() => handleChange("travelInsurance", "false")}
              />
              Do not include travel insurance
            </label>
            {errors.travelInsurance && (
              <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.travelInsurance}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" style={{ padding: "8px 20px", fontSize: 14, cursor: "pointer" }}>
            Submit
          </button>
          <button type="button" onClick={handleReset} style={{ padding: "8px 20px", fontSize: 14, cursor: "pointer" }}>
            Reset
          </button>
        </div>
      </form>

      {/* Output */}
      {submitted && formData && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: 8 }}>Collected form data</h3>
          <pre
            style={{
              background: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: "1rem",
              fontSize: 12,
              overflowX: "auto",
            }}
          >
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
