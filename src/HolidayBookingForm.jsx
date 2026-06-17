import { useState } from "react";

const TRANSFER_MODES = [
  "Cab",
  "Ferry",
  "Flight",
  "Train",
  "Bus",
  "Walking",
  "Bike",
];

const PLACES_BY_COUNTRY = [
  { country: "Thailand", places: [
    "Bangkok", "Phuket", "Chiang Mai", "Ko Samui", "Krabi",
    "Pattaya", "Koh Phi Phi", "Kanchanaburi",
  ]},
  { country: "Vietnam", places: [
    "Ho Chi Minh City", "Hanoi", "Ha Long Bay", "Hoi An",
    "Da Nang", "Nha Trang", "Phu Quoc",
  ]},
  { country: "Indonesia", places: [
    "Bali", "Lombok", "Yogyakarta", "Jakarta", "Komodo Island",
  ]},
  { country: "Malaysia", places: [
    "Kuala Lumpur", "Langkawi", "Penang", "Kota Kinabalu", "Malacca",
  ]},
  { country: "Singapore", places: [
    "Singapore",
  ]},
  { country: "Cambodia", places: [
    "Siem Reap (Angkor Wat)", "Phnom Penh", "Sihanoukville",
  ]},
  { country: "Philippines", places: [
    "Boracay", "Palawan", "Manila", "Cebu", "Siargao",
  ]},
  { country: "Myanmar", places: [
    "Bagan", "Inle Lake", "Yangon", "Mandalay",
  ]},
  { country: "Laos", places: [
    "Luang Prabang", "Vientiane", "Vang Vieng",
  ]},
];

const PRESET_ACTIVITIES = [
  "Snorkeling", "Scuba Diving", "Island Hopping", "Temple Visit",
  "City Tour", "Cooking Class", "Jungle Trek", "Safari",
  "Beach Relaxation", "Cultural Show", "Night Market Visit",
  "River Cruise", "Ziplining", "Cycling Tour", "Elephant Sanctuary Visit",
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
  "Hotel", "Resort", "Villa", "Serviced Apartment", "Homestay / Airbnb", "Other",
];

const ALL_DESTINATIONS = [
  "Bangkok", "Phuket", "Chiang Mai", "Ko Samui", "Krabi", "Pattaya",
  "Koh Phi Phi", "Kanchanaburi", "Hua Hin", "Koh Chang", "Pai",
  "Chiang Rai", "Ayutthaya", "Koh Lanta", "Koh Tao", "Koh Phangan",
  "Ho Chi Minh City", "Hanoi", "Ha Long Bay", "Hoi An", "Da Nang",
  "Nha Trang", "Phu Quoc", "Hue", "Sapa", "Mui Ne", "Da Lat",
  "Can Tho", "Ninh Binh", "Quy Nhon",
  "Bali", "Lombok", "Yogyakarta", "Jakarta", "Komodo Island",
  "Ubud", "Seminyak", "Gili Islands", "Flores", "Bandung",
  "Surabaya", "Makassar", "Labuan Bajo",
  "Kuala Lumpur", "Langkawi", "Penang", "Kota Kinabalu", "Malacca",
  "Kuching", "Ipoh", "Cameron Highlands", "Perhentian Islands",
  "Tioman Island", "Johor Bahru",
  "Singapore", "Sentosa Island", "Marina Bay", "Orchard Road",
  "Siem Reap", "Angkor Wat", "Phnom Penh", "Sihanoukville",
  "Koh Rong", "Battambang", "Kampot",
  "Boracay", "Palawan", "Manila", "Cebu", "Siargao",
  "El Nido", "Coron", "Bohol", "Davao", "Vigan", "Iloilo",
  "Bagan", "Inle Lake", "Yangon", "Mandalay", "Ngapali Beach",
  "Hpa-An", "Mawlamyine",
  "Luang Prabang", "Vientiane", "Vang Vieng", "Pakse",
  "Si Phan Don (Four Thousand Islands)",
];

const initialState = {
  dateOfDeparture: "",
  numberOfPax: "",
  numberOfAdults: "",
  numberOfKids: "",
  numberOfInfants: "",
  departureCity: "",
  placesToCover: {},
  expandedCountries: [],
  customLocationInput: "",
  customLocationCountry: "",
  customLocations: [],
  // Sightseeings
  sightseeingCountry: "",
  sightseeingLocation: "",
  sightseeingInput: "",
  sightseeings: [],           // [{ order, country, location, sightseeing }]
  transfers: {},              // { "country|location|country|location": "Cab" }
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

  // --- Derived: all selected places merged (preset + custom) ---
  const allSelectedPlaces = { ...form.placesToCover };
  form.customLocations.forEach(({ country, place }) => {
    if (!allSelectedPlaces[country]) allSelectedPlaces[country] = [];
    if (!allSelectedPlaces[country].includes(place)) {
      allSelectedPlaces[country] = [...allSelectedPlaces[country], place];
    }
  });

  const totalPlacesSelected = Object.values(allSelectedPlaces)
    .reduce((sum, arr) => sum + arr.length, 0);

  // --- Field handlers ---

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleCountry = (country) => {
    setForm((prev) => {
      const isExpanded = prev.expandedCountries.includes(country);
      return {
        ...prev,
        expandedCountries: isExpanded
          ? prev.expandedCountries.filter((c) => c !== country)
          : [...prev.expandedCountries, country],
      };
    });
  };

  const togglePlace = (country, place) => {
    setForm((prev) => {
      const current = prev.placesToCover[country] || [];
      const exists = current.includes(place);
      const updated = exists
        ? current.filter((p) => p !== place)
        : [...current, place];
      const newPlaces = { ...prev.placesToCover };
      if (updated.length === 0) {
        delete newPlaces[country];
      } else {
        newPlaces[country] = updated;
      }
      return { ...prev, placesToCover: newPlaces };
    });
  };

  const addCustomLocation = () => {
    const place   = form.customLocationInput.trim();
    const country = form.customLocationCountry.trim();
    if (!place || !country) return;
    setForm((prev) => ({
      ...prev,
      customLocations: [...prev.customLocations, { country, place }],
      customLocationInput: "",
      customLocationCountry: "",
    }));
  };

  const removeCustomLocation = (idx) => {
    setForm((prev) => ({
      ...prev,
      customLocations: prev.customLocations.filter((_, i) => i !== idx),
    }));
  };

  // --- Sightseeing handlers ---

  const addSightseeing = () => {
    const sightseeing = form.sightseeingInput.trim();
    if (!form.sightseeingCountry || !form.sightseeingLocation || !sightseeing) return;

    setForm((prev) => {
      // Check if this country+location already exists in tablets
      const existingEntry = prev.sightseeings.find(
        (s) => s.country === prev.sightseeingCountry && s.location === prev.sightseeingLocation
      );

      // Count unique locations already added to determine next order number
      const uniqueLocations = [
        ...new Map(
          prev.sightseeings.map((s) => [`${s.country}|${s.location}`, s.order])
        ).entries(),
      ];
      const order = existingEntry
        ? existingEntry.order                     // inherit same order as existing location
        : uniqueLocations.length + 1;             // new location gets next number

      return {
        ...prev,
        sightseeings: [
          ...prev.sightseeings,
          { order, country: prev.sightseeingCountry, location: prev.sightseeingLocation, sightseeing },
        ],
        sightseeingInput: "",   // only clear text — country and location stay selected
      };
    });
  };

  const removeSightseeing = (idx) => {
    setForm((prev) => ({
      ...prev,
      sightseeings: prev.sightseeings.filter((_, i) => i !== idx),
    }));
  };

  const updateSightseeingOrder = (idx, newOrder) => {
    setForm((prev) => {
      const updated = prev.sightseeings.map((s, i) =>
        i === idx ? { ...s, order: newOrder } : s
      );
      return { ...prev, sightseeings: updated };
    });
  };

  // When country changes in sightseeing adder, reset location
  const handleSightseeingCountry = (country) => {
    setForm((prev) => ({
      ...prev,
      sightseeingCountry:  country,
      sightseeingLocation: "",
      sightseeingInput:    "",
    }));
  };

  const handlePaxBreakdown = (field, value) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, [field]: cleaned }));
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

    if (parseInt(form.numberOfPax) >= 10)
      newErrors.numberOfPax = "10 or more passengers must use Group Booking.";

    if (form.numberOfAdults === "" || form.numberOfAdults === null)
      newErrors.numberOfAdults = "Number of adults is required.";
    else if (parseInt(form.numberOfAdults) < 1)
      newErrors.numberOfAdults = "Number of adults cannot be 0 or less.";

    if (form.numberOfKids === "" || form.numberOfKids === null)
      newErrors.numberOfKids = "Number of kids is required. Enter 0 if none.";
    else if (parseInt(form.numberOfKids) < 0)
      newErrors.numberOfKids = "Number of kids cannot be less than 0.";

    if (form.numberOfInfants === "" || form.numberOfInfants === null)
      newErrors.numberOfInfants = "Number of infants is required. Enter 0 if none.";
    else if (parseInt(form.numberOfInfants) < 0)
      newErrors.numberOfInfants = "Number of infants cannot be less than 0.";

    if (!form.departureCity)
      newErrors.departureCity = "Departure city is required.";

    if (totalPlacesSelected === 0)
      newErrors.placesToCover = "Select at least one place to cover.";

    if (transfers.some((t) => !t.mode.trim()))
      newErrors.transfers = "Select or type a mode of transfer for every leg of the journey.";

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

    // Merge preset + custom locations
    const mergedPlaces = { ...form.placesToCover };
    form.customLocations.forEach(({ country, place }) => {
      if (!mergedPlaces[country]) mergedPlaces[country] = [];
      if (!mergedPlaces[country].includes(place)) {
        mergedPlaces[country] = [...mergedPlaces[country], place];
      }
    });

    // Convert transfers object into the array shape FastAPI expects
    const transfersArray = transfers.map((t) => ({
      from_country:     t.fromCountry,
      from_location:    t.fromLocation,
      to_country:       t.toCountry,
      to_location:      t.toLocation,
      mode_of_transfer: t.mode,
    }));

    const payload = {
      date_of_departure:         form.dateOfDeparture || null,
      number_of_pax:             form.numberOfPax || null,
      number_of_adults:          form.numberOfAdults || null,
      number_of_kids:            form.numberOfKids || null,
      number_of_infants:         form.numberOfInfants || null,
      departure_city:            form.departureCity || null,
      places_to_cover:           mergedPlaces,
      sightseeings:              form.sightseeings,
      transfers:                 transfersArray,
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

  const isGroupBooking = parseInt(form.numberOfPax) >= 10;

  // Locations available for selected sightseeing country
  const sightseeingLocationOptions = form.sightseeingCountry
    ? (allSelectedPlaces[form.sightseeingCountry] || [])
    : [];

  // --- Mode of Transfer between locations ---

  const generateTransfers = () => {
    if (form.sightseeings.length < 2) return [];

    const sorted = [...form.sightseeings].sort((a, b) => a.order - b.order);
    const locationSequence = [];

    sorted.forEach((s) => {
      const lastEntry = locationSequence[locationSequence.length - 1];
      if (!lastEntry || lastEntry.location !== s.location) {
        locationSequence.push({
          location: s.location,
          country: s.country,
          sightseeings: [s.sightseeing],
        });
      } else {
        lastEntry.sightseeings.push(s.sightseeing);
      }
    });

    const result = [];
    for (let i = 0; i < locationSequence.length - 1; i++) {
      const fromLoc = locationSequence[i];
      const toLoc = locationSequence[i + 1];
      const transferKey = `${fromLoc.country}|${fromLoc.location}|${toLoc.country}|${toLoc.location}`;

      result.push({
        key: transferKey,
        fromCountry: fromLoc.country,
        fromLocation: fromLoc.location,
        fromSightseeings: fromLoc.sightseeings,
        toCountry: toLoc.country,
        toLocation: toLoc.location,
        toSightseeing: toLoc.sightseeings[0],
        mode: form.transfers[transferKey] || "",
      });
    }
    return result;
  };

  const transfers = generateTransfers();

  const handleTransferModeChange = (transferKey, mode) => {
    setForm((prev) => ({
      ...prev,
      transfers: { ...prev.transfers, [transferKey]: mode },
    }));
  };

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
          <input
            type="number"
            id="num-pax"
            min="1"
            placeholder="Enter number of passengers"
            value={form.numberOfPax}
            onChange={(e) => handleChange("numberOfPax", e.target.value)}
            style={{ padding: "6px 10px", fontSize: 14, width: 220 }}
          />
          {errors.numberOfPax && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.numberOfPax}</p>
          )}
          {isGroupBooking && (
            <p style={{ color: "red", marginTop: 6, fontWeight: 500 }}>
              10 or more passengers — please opt for Group Booking.
            </p>
          )}
        </div>

        {/* 2a. Pax Breakdown */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>
            2a. Passenger breakdown
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>No. of adults</label>
              <input
                type="number" min="1" placeholder="Enter number"
                value={form.numberOfAdults}
                onChange={(e) => handlePaxBreakdown("numberOfAdults", e.target.value)}
                style={{ padding: "6px 8px", fontSize: 13, width: "100%" }}
              />
              {errors.numberOfAdults && (
                <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.numberOfAdults}</p>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>No. of kids</label>
              <input
                type="number" min="0" placeholder="Enter number"
                value={form.numberOfKids}
                onChange={(e) => handlePaxBreakdown("numberOfKids", e.target.value)}
                style={{ padding: "6px 8px", fontSize: 13, width: "100%" }}
              />
              {errors.numberOfKids && (
                <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.numberOfKids}</p>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>No. of infants</label>
              <input
                type="number" min="0" placeholder="Enter number"
                value={form.numberOfInfants}
                onChange={(e) => handlePaxBreakdown("numberOfInfants", e.target.value)}
                style={{ padding: "6px 8px", fontSize: 13, width: "100%" }}
              />
              {errors.numberOfInfants && (
                <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.numberOfInfants}</p>
              )}
            </div>
          </div>
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
          {totalPlacesSelected > 0 && (
            <p style={{ fontSize: 12, color: "#2d7a3a", marginBottom: 8 }}>
              {totalPlacesSelected} place{totalPlacesSelected > 1 ? "s" : ""} selected
              across {Object.keys(allSelectedPlaces).length} country/countries
            </p>
          )}
          <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>
            {PLACES_BY_COUNTRY.map(({ country, places }, idx) => {
              const isOpen = form.expandedCountries.includes(country);
              const selectedInCountry = form.placesToCover[country] || [];
              return (
                <div key={country} style={{ borderTop: idx === 0 ? "none" : "1px solid #e0e0e0" }}>
                  <div
                    onClick={() => toggleCountry(country)}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 14px", cursor: "pointer",
                      background: isOpen ? "#fafafa" : "#fff", userSelect: "none",
                    }}
                  >
                    <span style={{ fontWeight: isOpen ? 500 : 400, fontSize: 13 }}>{country}</span>
                    <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 8 }}>
                      {selectedInCountry.length > 0 && (
                        <span style={{
                          background: "#e6f4ea", color: "#2d7a3a",
                          padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                        }}>
                          {selectedInCountry.length} selected
                        </span>
                      )}
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                  {isOpen && (
                    <div style={{
                      padding: "8px 14px 12px", background: "#fafafa",
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px",
                    }}>
                      {places.map((place) => (
                        <label key={place} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                          <input
                            type="checkbox"
                            checked={selectedInCountry.includes(place)}
                            onChange={() => togglePlace(country, place)}
                          />
                          {place}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {errors.placesToCover && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.placesToCover}</p>
          )}

          {/* Custom location entry */}
          <div style={{ marginTop: 14, padding: 12, border: "1px dashed #ccc", borderRadius: 6 }}>
            <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, marginTop: 0 }}>
              Add a location not listed above
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <select
                  value={form.customLocationCountry}
                  onChange={(e) => handleChange("customLocationCountry", e.target.value)}
                  style={{ padding: "6px 10px", fontSize: 13, width: "100%" }}
                >
                  <option value="">— Select country —</option>
                  {PLACES_BY_COUNTRY.map(({ country }) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input
                  type="text"
                  id="custom-location-input"
                  list="destinations-list"
                  placeholder="Location name e.g. Ko Lipe"
                  value={form.customLocationInput}
                  onChange={(e) => handleChange("customLocationInput", e.target.value)}
                  style={{ padding: "6px 10px", fontSize: 13, width: "100%" }}
                />
                <datalist id="destinations-list">
                  {ALL_DESTINATIONS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>
              <button
                type="button"
                onClick={addCustomLocation}
                style={{ padding: "6px 14px", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Add location
              </button>
            </div>
            {form.customLocations.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {form.customLocations.map((loc, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 12,
                      background: "#fff8e1", border: "1px solid #f5c842",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    {loc.place} ({loc.country})
                    <button
                      type="button"
                      onClick={() => removeCustomLocation(i)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}
                    >×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 5. Sightseeings */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>
            5. Sightseeings
          </label>

          {totalPlacesSelected === 0 ? (
            <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
              Select places in section 4 first to add sightseeings.
            </p>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>

              {/* FIRST BAR — Country (only countries selected in section 4) */}
              <select
                value={form.sightseeingCountry}
                onChange={(e) => handleSightseeingCountry(e.target.value)}
                style={{ padding: "6px 10px", fontSize: 13, minWidth: 150 }}
              >
                <option value="">— Country —</option>
                {Object.keys(allSelectedPlaces).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* SECOND BAR — Location (only locations from selected country) */}
              {form.sightseeingCountry && (
                <select
                  value={form.sightseeingLocation}
                  onChange={(e) => handleChange("sightseeingLocation", e.target.value)}
                  style={{ padding: "6px 10px", fontSize: 13, minWidth: 160 }}
                >
                  <option value="">— Location —</option>
                  {sightseeingLocationOptions.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              )}

              {/* THIRD — Sightseeing text input (only visible once location is selected) */}
              {form.sightseeingLocation && (
                <input
                  type="text"
                  placeholder="e.g. Trekking, Island Tour"
                  value={form.sightseeingInput}
                  onChange={(e) => handleChange("sightseeingInput", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSightseeing())}
                  style={{ padding: "6px 10px", fontSize: 13, minWidth: 180, flex: 1 }}
                />
              )}

              {/* Add button */}
              {form.sightseeingLocation && (
                <button
                  type="button"
                  onClick={addSightseeing}
                  style={{ padding: "6px 14px", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Add
                </button>
              )}
            </div>
          )}

          {/* Sightseeing tablets */}
          {form.sightseeings.length > 0 && (
            <div>
              <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                Set the order number to arrange the sequence of the itinerary.
              </p>
              {form.sightseeings.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 12px", marginBottom: 6,
                    background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: 6,
                  }}
                >
                  {/* Order number dropdown */}
                  <select
                    value={s.order}
                    onChange={(e) => updateSightseeingOrder(i, parseInt(e.target.value))}
                    style={{ padding: "4px 6px", fontSize: 13, width: 60, flexShrink: 0 }}
                  >
                    {form.sightseeings.map((_, n) => (
                      <option key={n + 1} value={n + 1}>{n + 1}</option>
                    ))}
                  </select>

                  {/* Tablet content */}
                  <span style={{ fontSize: 13, flex: 1 }}>
                    <strong>{s.country}</strong>
                    <span style={{ color: "#888", margin: "0 6px" }}>→</span>
                    <strong>{s.location}</strong>
                    <span style={{ color: "#888", margin: "0 6px" }}>→</span>
                    {s.sightseeing}
                  </span>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeSightseeing(i)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 16, color: "#999", padding: 0, flexShrink: 0,
                    }}
                    aria-label={`Remove ${s.sightseeing}`}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 6. Mode of Transfer Between Sightseeing Locations */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            6. Mode of transfer between sightseeing locations
          </label>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
            Auto-generated from the sightseeings above. Select or type the transfer mode for each leg.
          </p>

          {transfers.length === 0 ? (
            <p style={{ fontSize: 13, color: "#999" }}>
              Add at least 2 sightseeings at different locations to generate transfer legs.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {transfers.map((transfer) => (
                <div
                  key={transfer.key}
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 6,
                    padding: 14,
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                      fontSize: 13,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>
                      {transfer.fromLocation}{" "}
                      <span style={{ color: "#888" }}>
                        ({transfer.fromSightseeings.join(", ")})
                      </span>
                    </div>
                    <div style={{ fontSize: 18, color: "#333" }}>──→</div>
                    <div style={{ fontWeight: 500 }}>
                      {transfer.toLocation}{" "}
                      <span style={{ color: "#888" }}>({transfer.toSightseeing})</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <select
                      value={TRANSFER_MODES.includes(transfer.mode) ? transfer.mode : ""}
                      onChange={(e) => handleTransferModeChange(transfer.key, e.target.value)}
                      style={{
                        padding: "8px 10px",
                        fontSize: 13,
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        flex: 1,
                        minWidth: 200,
                      }}
                    >
                      <option value="">— Select or type mode —</option>
                      {TRANSFER_MODES.map((mode) => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Or type custom (e.g., Private Yacht)"
                      value={transfer.mode}
                      onChange={(e) => handleTransferModeChange(transfer.key, e.target.value)}
                      style={{
                        padding: "8px 10px",
                        fontSize: 13,
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        flex: 1,
                        minWidth: 200,
                      }}
                    />
                  </div>

                  {transfer.mode && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#2d7a3a" }}>
                      ✓ Selected: <strong>{transfer.mode}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {errors.transfers && (
            <p style={{ color: "red", fontSize: 12, marginTop: 8 }}>{errors.transfers}</p>
          )}
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
                type="radio" name="visa" value="true"
                checked={form.visa === "true"}
                onChange={() => handleChange("visa", "true")}
              />
              Include VISA
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="radio" name="visa" value="false"
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
                type="radio" name="insurance" value="true"
                checked={form.travelInsurance === "true"}
                onChange={() => handleChange("travelInsurance", "true")}
              />
              Include travel insurance
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="radio" name="insurance" value="false"
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
          <pre style={{
            background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 6,
            padding: "1rem", fontSize: 12, overflowX: "auto",
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
