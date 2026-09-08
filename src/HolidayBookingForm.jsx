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

const MOCK_HOTELS = [
  { name: "Lavencos Hotel GM", rating: 3 },
  { name: "Parosand Hanoi Hotel & Apartment", rating: 4 },
  { name: "Gaia Hotel Phu Quoc", rating: 5 },
];

const MEAL_OPTIONS = [
  "Breakfast",
  "Lunch",
  "Snacks",
  "Dinner",
  "Special Dinner"
];

const ROOM_TYPES = [
  "VIP Suite",
  "Normal 2 Adults in 1 room occupancy",
  "Single person",
  "3 persons in single room",
  "4 persons in single room"
];

// =============================================================================
// DEV ONLY — Test autofill data (mirrors SAMPLE_BOOKING_VIETNAM_VISA in
// booking_data.py). Delete or guard behind an env flag before going to prod.
// =============================================================================

// The arrival airport used in the Vietnam test booking
const _VN_ARRIVAL  = "Noi Bai International Airport (HAN) — Hanoi";
const _VN_RETURN   = "Noi Bai International Airport (HAN) — Hanoi";
const _VN_DEPART   = "Chhatrapati Shivaji Maharaj International Airport (BOM) — Mumbai";

// transfer.transfers state only stores mode for non-fixed (non-Flight) legs.
// Keys must exactly match what generateTransfers() produces at runtime.
// Fixed Flight legs (LEG 1 and LEG N) are hardcoded to "Flight" and never
// stored in form.transfers, so we only need the two variable legs here:
//   LEG 2: __airport_to_hotel__|<arrivalAirport>|<firstStop.country>|<firstStop.location>
//   LEG 3: <fromCountry>|<fromLocation>|<toCountry>|<toLocation>  (inter-stop)
//   LEG N-1: __hotel_to_airport__|<lastStop.country>|<lastStop.location>|<returnAirport>
const _VN_TRANSFERS = {
  [`__airport_to_hotel__|${_VN_ARRIVAL}|Vietnam|Hanoi`]: "Private Car",
  ["Vietnam|Hanoi|Vietnam|Hoi An"]: "Flight",
  [`__hotel_to_airport__|Vietnam|Hoi An|${_VN_RETURN}`]: "Private Car",
};

// stopHotels: { [stopIndex]: { name, rating, roomType, meals[], pool, beach } }
// Hotel names don't have to match MOCK_HOTELS — the form also accepts any
// free-text value. But if they DO match, rating auto-fills from MOCK_HOTELS.
// Using names not in MOCK_HOTELS here since the sample booking uses realistic
// hotel names; rating is supplied explicitly.
const _VN_STOP_HOTELS = {
  0: {
    name: "Hanoi Old Quarter Heritage Hotel",
    rating: 4,
    roomType: "Normal 2 Adults in 1 room occupancy",
    meals: ["Breakfast", "Dinner"],
    pool: true,   // maps to "Swimming Pool Access, Free Wifi, Free Self Parking"
    beach: false,
  },
  1: {
    name: "Hoi An Riverside Boutique Resort",
    rating: 5,
    roomType: "VIP Suite",
    meals: ["Breakfast", "Lunch", "Dinner"],
    pool: false,
    beach: true,  // maps to "Private Beach Front"
  },
};

const DEV_TEST_STATE = {
  customerName:     "Priya Sharma",
  dateOfDeparture:  "2026-09-15",
  totalNights:      "5",
  numberOfPax:      "3",
  numberOfAdults:   "2",
  numberOfKids:     "1",
  numberOfInfants:  "0",
  departureCity:    _VN_DEPART,
  arrivalAirport:   _VN_ARRIVAL,
  returnAirport:    _VN_RETURN,

  // Places — must use keys/values from PLACES_BY_COUNTRY
  placesToCover: { Vietnam: ["Hanoi", "Hoi An"] },
  expandedCountries: [],
  customLocationInput: "",
  customLocationCountry: "",
  customLocations: [],

  // Sightseeings — order values mirror SAMPLE_BOOKING_VIETNAM_VISA
  sightseeings: [
    { order: 1, country: "Vietnam", location: "Hanoi",  sightseeing: "Hoan Kiem Lake & Old Quarter Walking Tour" },
    { order: 1, country: "Vietnam", location: "Hanoi",  sightseeing: "Temple of Literature Visit" },
    { order: 1, country: "Vietnam", location: "Hanoi",  sightseeing: "Vietnamese Street Food Cooking Class" },
    { order: 2, country: "Vietnam", location: "Hoi An", sightseeing: "Ancient Town Exploration & Photo Tour" },
    { order: 2, country: "Vietnam", location: "Hoi An", sightseeing: "Lantern-Making Workshop" },
    { order: 2, country: "Vietnam", location: "Hoi An", sightseeing: "Thu Bon River Sunset Cruise" },
  ],
  sightseeingCountry:  "",
  sightseeingLocation: "",
  sightseeingInput:    "",

  // Nights: stopNights only contains non-last stops (idx 0 = Hanoi: 2N).
  // Hoi An (idx 1) is the last stop — auto-calculated as 5 - 2 = 3N.
  stopNights: { 0: "2" },
  stopHotels: _VN_STOP_HOTELS,

  // Transfer modes (non-fixed legs only — see key format note above)
  transfers: _VN_TRANSFERS,

  visa:            "true",
  travelInsurance: "true",

  // Optional fields
  totalPackageCost: "145000",
  agentName:        "Priya Holidays Specialist",
  agentPhone:       "9988776655",
  agentEmail:       "priya.specialist@example-ota.in",
};

// =============================================================================

const initialState = {
  customerName: "",
  dateOfDeparture: "",
  totalNights: "",        // 2a. manual input — drives total_nights / total_days
  stopNights: {},         // 7. { [stopIndex]: "2" } — nights entered per non-last stop
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
  //accommodationDropdown: "",
  //accommodationText: "",
  visa: null,
  travelInsurance: null,
  // Subtask 4.2 — new optional fields
  totalPackageCost: "",
  agentName: "",
  agentPhone: "",
  agentEmail: "",
  totalNights: "",        
  stopNights: {},         
  stopHotels: {},         // NEW: { [stopIndex]: { name: "", rating: "", roomType: "", meals: [], pool: false, beach: false } }
  numberOfPax: "",
  arrivalAirport: "",
  returnAirport: "",
  placesToCover: {},
};

// Groups an ordered list of sightseeing entries into "stops" — consecutive
// entries at the same location collapse into a single stop. Shared by the
// transfer-leg generator (section 8) and the nights-per-stop section (section 7).
function deriveStops(sightseeings) {
  if (sightseeings.length === 0) return [];

  const sorted = [...sightseeings].sort((a, b) => a.order - b.order);
  const stops = [];

  sorted.forEach((s) => {
    const lastEntry = stops[stops.length - 1];
    if (!lastEntry || lastEntry.location !== s.location) {
      stops.push({
        location: s.location,
        country: s.country,
        sightseeings: [s.sightseeing],
      });
    } else {
      lastEntry.sightseeings.push(s.sightseeing);
    }
  });

  return stops;
}

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

    if (!form.customerName)
      newErrors.customerName = "Customer name is required.";

    if (!form.dateOfDeparture)
      newErrors.dateOfDeparture = "Date of departure is required.";

    if (!form.totalNights)
      newErrors.totalNights = "Total nights for the trip is required.";
    else if (parseInt(form.totalNights, 10) < 1)
      newErrors.totalNights = "Total nights must be at least 1.";

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

    if (stops.length === 0) {
      newErrors.stopsNights = "Add sightseeings above to allocate nights per stop.";
    } else {
      const lastIdx = stops.length - 1;
      const everyNonLastFilled = stops.every((_, idx) => {
        if (idx === lastIdx) return true;
        const v = parseInt(form.stopNights[idx], 10);
        return !isNaN(v) && v >= 1;
      });
      if (!everyNonLastFilled) {
        newErrors.stopsNights = "Enter at least 1 night for every stop except the last.";
      } else if (isOverAllocated) {
        newErrors.stopsNights =
          `Nights allocated (${allocatedNights}) exceed total nights for the trip ` +
          `(${totalNightsNum}). Adjust the values above or revise section 2a.`;
      }
    }

    if (transfers.some((t) => !t.mode.trim()))
      newErrors.transfers = "Select or type a mode of transfer for every leg of the journey.";

    //if (!form.accommodationText)
      //newErrors.accommodationText = "Accommodation is required.";

    if (!form.visa)
      newErrors.visa = "Please select a VISA preference.";

    if (!form.travelInsurance)
      newErrors.travelInsurance = "Please select a travel insurance preference.";
    
    if (!form.departureCity)
      newErrors.departureCity = "Departure city is required.";
      
    if (!form.arrivalAirport)
      newErrors.arrivalAirport = "Arrival airport (destination) is required.";
      
    if (!form.returnAirport)
      newErrors.returnAirport = "Return airport (destination) is required.";

    if (totalPlacesSelected === 0)
      newErrors.placesToCover = "Select at least one place to cover.";

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

    // Build stops array — every stop including the auto-calculated last one,
    // since the future PDF date math needs every stop's nights, never null.
    const lastIdx = stops.length - 1;
    const stopsArray = stops.map((s, idx) => {
      const hotelData = form.stopHotels[idx] || {};
      
      // Combine meals, pool, and beach into the single amenities string the backend expects
      const amenitiesList = [];
      if (hotelData.pool) amenitiesList.push("Swimming Pool Access");
      if (hotelData.beach) amenitiesList.push("Private Beach Front");

      return {
        stop_order: idx + 1,
        country:    s.country,
        location:   s.location,
        nights:     idx === lastIdx ? lastStopNights : parseInt(form.stopNights[idx], 10),
        // NEW HOTEL FIELDS:
        hotel_name:        hotelData.name || null,
        hotel_star_rating: hotelData.rating || null,
        hotel_room_type:   hotelData.roomType || null,
        hotel_meal_plan:   hotelData.meals?.length > 0 ? hotelData.meals.join(", ") : null, 
        hotel_amenities:   amenitiesList.length > 0 ? amenitiesList.join(", ") : null,
      };
    });

    const payload = {
      customer_name:              form.customerName || null,
      date_of_departure:         form.dateOfDeparture || null,
      number_of_pax:             form.numberOfPax || null,
      number_of_adults:          form.numberOfAdults || null,
      number_of_kids:            form.numberOfKids || null,
      number_of_infants:         form.numberOfInfants || null,
      departure_city:            form.departureCity || null,
      places_to_cover:           mergedPlaces,
      arrival_airport:           form.arrivalAirport || null,
      return_airport:            form.returnAirport || null, 
      sightseeings:              form.sightseeings,
      transfers:                 transfersArray,
      total_nights:              totalNightsNum,
      total_days:                totalDaysNum === "" ? null : totalDaysNum,
      stops:                     stopsArray,
      //accommodation:             form.accommodationText || null,
      visa_included:             form.visa,
      travel_insurance_included: form.travelInsurance,
      // Subtask 4.2 — new optional fields
      total_package_cost:        form.totalPackageCost ? parseInt(form.totalPackageCost, 10) : null,
      agent_name:                form.agentName  || null,
      agent_phone:               form.agentPhone || null,
      agent_email:               form.agentEmail || null,
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

  // DEV ONLY — loads DEV_TEST_STATE into the form so you can test PDF
  // changes without manually filling every field each time.
  const handleAutofill = () => {
    setForm(DEV_TEST_STATE);
    setSubmitted(false);
    setFormData(null);
    setErrors({});
  };
  
  const handleDownloadPdf = () => {
    if (!formData?.booking_id) return;
    window.open(`http://localhost:8000/api/bookings/${formData.booking_id}/pdf`, "_blank");
  };
  
  const isGroupBooking = parseInt(form.numberOfPax) >= 10;

  // Locations available for selected sightseeing country
  const sightseeingLocationOptions = form.sightseeingCountry
    ? (allSelectedPlaces[form.sightseeingCountry] || [])
    : [];

  // --- Nights per stop (section 7) ---

  const stops = deriveStops(form.sightseeings);
  const lastStopIdx = stops.length - 1;

  const totalNightsNum = form.totalNights === "" ? null : parseInt(form.totalNights, 10);
  const totalDaysNum =
    totalNightsNum !== null && !isNaN(totalNightsNum) ? totalNightsNum + 1 : "";

  // Sum of nights typed into every stop EXCEPT the last (the last is auto-calculated)
  const allocatedNights = stops.reduce((sum, _, idx) => {
    if (idx === lastStopIdx) return sum;
    const v = parseInt(form.stopNights[idx], 10);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);

  const lastStopNights =
    totalNightsNum !== null && !isNaN(totalNightsNum) ? totalNightsNum - allocatedNights : null;

  // Only possible by reducing the 2a total AFTER stops were filled in — flagged here,
  // not auto-corrected, and blocked at submit (validate()) rather than live.
  const isOverAllocated = totalNightsNum !== null && allocatedNights > totalNightsNum;

  const handleTotalNights = (value) => {
    handleChange("totalNights", value.replace(/[^0-9]/g, ""));
  };

  // Hard block: a keystroke that would push the running total over total_nights is
  // rejected outright (value stays at its last valid state) rather than clamped.
  const handleStopNightsChange = (idx, rawValue) => {
    const cleaned = rawValue.replace(/[^0-9]/g, "");

    setForm((prev) => {
      if (cleaned === "") {
        const updated = { ...prev.stopNights };
        delete updated[idx];
        return { ...prev, stopNights: updated };
      }

      const newVal = parseInt(cleaned, 10);
      const total = prev.totalNights === "" ? null : parseInt(prev.totalNights, 10);
      const stopsNow = deriveStops(prev.sightseeings);
      const lastIdxNow = stopsNow.length - 1;

      let othersSum = 0;
      stopsNow.forEach((_, i) => {
        if (i === lastIdxNow || i === idx) return;
        const v = parseInt(prev.stopNights[i], 10);
        if (!isNaN(v)) othersSum += v;
      });

      if (total !== null && !isNaN(total) && othersSum + newVal > total) {
        return prev; // reject — over the cap, keystroke has no effect
      }

      return { ...prev, stopNights: { ...prev.stopNights, [idx]: cleaned } };
    });
  };
  
  const handleStopHotelChange = (idx, field, value) => {
    setForm((prev) => {
      // Get current hotel state for this stop, or initialize a blank one
      const currentHotel = prev.stopHotels[idx] || { 
        name: "", rating: "", roomType: "", meals: [], pool: false, beach: false 
      };

      let newValue = value;

      // Auto-fill star rating when a mock hotel is selected
      if (field === "name") {
        const selectedHotel = MOCK_HOTELS.find(h => h.name === value);
        currentHotel.rating = selectedHotel ? selectedHotel.rating : "";
      } 
      // Handle the array of meal checkboxes
      else if (field === "meals") {
        const { meal, checked } = value;
        const currentMeals = currentHotel.meals || [];
        newValue = checked 
          ? [...currentMeals, meal] 
          : currentMeals.filter(m => m !== meal);
      }

      return {
        ...prev,
        stopHotels: {
          ...prev.stopHotels,
          [idx]: { 
            ...currentHotel, 
            [field === "meals" ? "meals" : field]: newValue 
          }
        }
      };
    });
  };
  // --- Mode of Transfer between locations ---

  const generateTransfers = () => {
    const locationSequence = deriveStops(form.sightseeings);
    if (locationSequence.length === 0) return [];

    const result = [];

    // LEG 1: Home Airport -> Arrival Airport (Hardcoded Flight)
    if (form.departureCity && form.arrivalAirport) {
      const flightInKey = `__flight_in__|${form.departureCity}|${form.arrivalAirport}`;
      result.push({
        key: flightInKey,
        fromCountry: "Home",
        fromLocation: form.departureCity,
        fromSightseeings: ["Departure Airport"],
        toCountry: "Destination",
        toLocation: form.arrivalAirport,
        toSightseeing: "Arrival Airport",
        mode: "Flight",
        isFixedFlight: true,
        isAirportLeg: true,
      });
    }

    // LEG 2 (PHASE 1): Arrival Airport -> First Hotel
    if (form.arrivalAirport && locationSequence.length > 0) {
      const firstStop = locationSequence[0];
      const firstHotelName = form.stopHotels[0]?.name || "Hotel (TBD)";
      const airportToHotelKey = `__airport_to_hotel__|${form.arrivalAirport}|${firstStop.country}|${firstStop.location}`;
      result.push({
        key: airportToHotelKey,
        fromCountry: "Destination",
        fromLocation: form.arrivalAirport,
        fromSightseeings: ["Arrival Airport"],
        toCountry: firstStop.country,
        toLocation: firstStop.location,
        toSightseeing: firstHotelName, // Replaced sightseeing with Hotel
        mode: form.transfers[airportToHotelKey] || "",
        isFixedFlight: false,
        isAirportLeg: true,
      });
    }

    // LEGS 3 to N-2 (PHASE 2): Inter-stop legs (Hotel to Hotel)
    for (let i = 0; i < locationSequence.length - 1; i++) {
      const fromLoc = locationSequence[i];
      const toLoc = locationSequence[i + 1];
      
      const fromHotelName = form.stopHotels[i]?.name || "Hotel (TBD)";
      const toHotelName = form.stopHotels[i + 1]?.name || "Hotel (TBD)";
      
      const transferKey = `${fromLoc.country}|${fromLoc.location}|${toLoc.country}|${toLoc.location}`;

      result.push({
        key: transferKey,
        fromCountry: fromLoc.country,
        fromLocation: fromLoc.location,
        fromSightseeings: [fromHotelName], // Replaced sightseeings with Departure Hotel
        toCountry: toLoc.country,
        toLocation: toLoc.location,
        toSightseeing: toHotelName, // Replaced sightseeing with Arrival Hotel
        mode: form.transfers[transferKey] || "",
        isFixedFlight: false,
        isAirportLeg: false,
      });
    }

    // LEG N-1 (PHASE 3): Last Hotel -> Return Airport
    if (form.returnAirport && locationSequence.length > 0) {
      const lastIndex = locationSequence.length - 1;
      const lastStop = locationSequence[lastIndex];
      const lastHotelName = form.stopHotels[lastIndex]?.name || "Hotel (TBD)";
      
      const hotelToAirportKey = `__hotel_to_airport__|${lastStop.country}|${lastStop.location}|${form.returnAirport}`;
      result.push({
        key: hotelToAirportKey,
        fromCountry: lastStop.country,
        fromLocation: lastStop.location,
        fromSightseeings: [lastHotelName], // Replaced sightseeings with Final Hotel
        toCountry: "Destination",
        toLocation: form.returnAirport,
        toSightseeing: "Return Airport",
        mode: form.transfers[hotelToAirportKey] || "",
        isFixedFlight: false,
        isAirportLeg: true,
      });
    }

    // LEG N (PHASE 4): Return Airport -> Home Airport (Hardcoded Flight)
    if (form.returnAirport && form.departureCity) {
      const flightOutKey = `__flight_out__|${form.returnAirport}|${form.departureCity}`;
      result.push({
        key: flightOutKey,
        fromCountry: "Destination",
        fromLocation: form.returnAirport, 
        fromSightseeings: ["Return Airport"],
        toCountry: "Home",
        toLocation: form.departureCity,
        toSightseeing: "Return Airport",
        mode: "Flight",
        isFixedFlight: true, 
        isAirportLeg: true,
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

      {/* ── DEV TOOLBAR ─────────────────────────────────────────────────────────
          Remove this block (or guard with import.meta.env.DEV) before shipping.
          Loads DEV_TEST_STATE (Vietnam, 5N/6D, Priya Sharma) so you can reach
          "Download PDF" in one click instead of filling the form manually.
      ─────────────────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: "1.25rem",
        padding: "10px 14px",
        background: "#fffbeb",
        border: "1px solid #f5c842",
        borderRadius: 6,
        fontSize: 12,
      }}>
        <span style={{ fontSize: 16 }}>🛠</span>
        <span style={{ color: "#7a5c00", fontWeight: 500 }}>Dev toolbar</span>
        <span style={{ color: "#999", margin: "0 4px" }}>·</span>
        <span style={{ color: "#555" }}>Vietnam 5N/6D · Priya Sharma · visa incl.</span>
        <button
          type="button"
          onClick={handleAutofill}
          style={{
            marginLeft: "auto",
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            background: "#f5c842",
            border: "none",
            borderRadius: 4,
            color: "#3a2c00",
          }}
        >
          Autofill test data
        </button>
      </div>

      <h2 style={{ marginBottom: "0.25rem" }}>Holiday Booking — Customer Query Form</h2>
      <p style={{ color: "#666", marginBottom: "2rem", fontSize: 12 }}>
        Internal use only — Holidays vertical
      </p>

      <form onSubmit={handleSubmit}>

        {/* 1. Customer Name */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="customer-name" style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            1. Customer name
          </label>
          <input
            type="text"
            id="customer-name"
            placeholder="Enter customer's full name"
            value={form.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            style={{ padding: "6px 10px", fontSize: 14, width: 320 }}
          />
          {errors.customerName && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.customerName}</p>
          )}
        </div>

        {/* 2. Date of Departure */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="departure-date" style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            2. Date of departure
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

        {/* 2a. Trip duration */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="total-nights" style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            2a. Total nights for the trip
          </label>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div>
              <input
                type="number"
                id="total-nights"
                min="1"
                placeholder="e.g. 4"
                value={form.totalNights}
                onChange={(e) => handleTotalNights(e.target.value)}
                style={{ padding: "6px 10px", fontSize: 14, width: 120 }}
              />
              {errors.totalNights && (
                <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.totalNights}</p>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 6 }}>
                Total days (auto)
              </label>
              <div style={{
                padding: "6px 10px", fontSize: 14, width: 90,
                background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 4,
              }}>
                {totalDaysNum === "" ? "—" : totalDaysNum}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Number of Pax */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="num-pax" style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            3. Number of passengers
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

        {/* 3a. Pax Breakdown */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>
            3a. Passenger breakdown
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

        {/* 4. Airports & Flights */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>
            4. Airports & Flights
          </label>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {/* 4a. Home Departure City */}
            <div style={{ flex: "1 1 200px" }}>
              <label htmlFor="departure-city" style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                Home Departure Airport
              </label>
              <select
                id="departure-city"
                value={form.departureCity}
                onChange={(e) => handleChange("departureCity", e.target.value)}
                style={{ padding: "6px 10px", fontSize: 14, width: "100%", boxSizing: "border-box" }}
              >
                <option value="">— Select home airport —</option>
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

            {/* 4b. Arrival Airport - CONVERTED TO DROPDOWN */}
            <div style={{ flex: "1 1 200px" }}>
              <label htmlFor="arrival-airport" style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                Arrival Airport at Destination
              </label>
              <select
                id="arrival-airport"
                value={form.arrivalAirport}
                onChange={(e) => handleChange("arrivalAirport", e.target.value)}
                style={{ padding: "6px 10px", fontSize: 14, width: "100%", boxSizing: "border-box" }}
              >
                <option value="">— Select arrival airport —</option>
                {AIRPORTS.map(({ group, options }) => (
                  <optgroup key={group} label={group}>
                    {options.map((airport) => (
                      <option key={airport} value={airport}>{airport}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.arrivalAirport && (
                <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.arrivalAirport}</p>
              )}
            </div>

            {/* 4c. Return Airport - CONVERTED TO DROPDOWN */}
            <div style={{ flex: "1 1 200px" }}>
              <label htmlFor="return-airport" style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
                Return Airport from the last location
              </label>
              <select
                id="return-airport"
                value={form.returnAirport}
                onChange={(e) => handleChange("returnAirport", e.target.value)}
                style={{ padding: "6px 10px", fontSize: 14, width: "100%", boxSizing: "border-box" }}
              >
                <option value="">— Select return airport —</option>
                {AIRPORTS.map(({ group, options }) => (
                  <optgroup key={group} label={group}>
                    {options.map((airport) => (
                      <option key={airport} value={airport}>{airport}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.returnAirport && (
                <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.returnAirport}</p>
              )}
            </div>
          </div>
        </div>
        
        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 5. Places to Cover */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>
            5. Places to be covered (select all that apply)
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

        {/* 6. Sightseeings */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>
            6. Sightseeings
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

        {/* 7. Nights per stop */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            7. Nights per stop
          </label>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
            Derived from the sightseeings above. Enter nights for every stop except the
            last — its nights are calculated automatically from section 2a.
          </p>

          {stops.length === 0 ? (
            <p style={{ fontSize: 13, color: "#999" }}>
              Add sightseeings above to allocate nights per stop.
            </p>
          ) : (
            <>
              <p style={{
                fontSize: 13, fontWeight: 500, marginBottom: 12,
                color: isOverAllocated ? "#c0392b" : "#2d7a3a",
              }}>
                {allocatedNights} of {totalNightsNum ?? "—"} nights allocated
                {isOverAllocated && " — over allocated, adjust below or revise section 2a"}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stops.map((stop, idx) => {
                  const isLast = idx === lastStopIdx;
                  return (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 6,
                        padding: 14,
                        background: "#fafafa",
                      }}
                    >
                      <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 8 }}>
                        {stop.country} → {stop.location}{" "}
                        <span style={{ color: "#888", fontWeight: 400 }}>
                          ({stop.sightseeings.join(", ")})
                        </span>
                      </div>
                      
                      {/* --- EXISTING NIGHTS INPUT --- */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <label style={{ fontSize: 13 }}>Nights here</label>
                        {isLast ? (
                          <div style={{
                            padding: "6px 10px", fontSize: 13, width: 80,
                            background: "#f0f0f0", border: "1px solid #ddd", borderRadius: 4,
                          }}>
                            {lastStopNights ?? "—"}
                            <span style={{ fontSize: 11, color: "#888", marginLeft: 6 }}>(auto)</span>
                          </div>
                        ) : (
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 2"
                            value={form.stopNights[idx] ?? ""}
                            onChange={(e) => handleStopNightsChange(idx, e.target.value)}
                            style={{ padding: "6px 10px", fontSize: 13, width: 80 }}
                          />
                        )}
                      </div>

                      {/* --- NEW HOTEL UI --- */}
                      <div style={{ marginTop: 16, borderTop: "1px dashed #ccc", paddingTop: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, display: "block" }}>
                          Hotel & Accommodation
                        </label>
                        
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                          {/* Hotel Name Dropdown */}
                          <select
                            value={form.stopHotels[idx]?.name || ""}
                            onChange={(e) => handleStopHotelChange(idx, "name", e.target.value)}
                            style={{ padding: "6px 10px", fontSize: 13, minWidth: 150 }}
                          >
                            <option value="">— Select Hotel —</option>
                            {MOCK_HOTELS.map(h => (
                              <option key={h.name} value={h.name}>{h.name}</option>
                            ))}
                          </select>

                          {/* Read-Only Star Rating */}
                          <div style={{ padding: "6px 10px", fontSize: 13, background: "#f0f0f0", borderRadius: 4, minWidth: 80 }}>
                            {form.stopHotels[idx]?.rating ? `${form.stopHotels[idx].rating} Star` : "Rating"}
                          </div>

                          {/* Room Type Dropdown */}
                          <select
                            value={form.stopHotels[idx]?.roomType || ""}
                            onChange={(e) => handleStopHotelChange(idx, "roomType", e.target.value)}
                            style={{ padding: "6px 10px", fontSize: 13, flex: 1, minWidth: 200 }}
                          >
                            <option value="">— Select Room Type —</option>
                            {ROOM_TYPES.map(rt => (
                              <option key={rt} value={rt}>{rt}</option>
                            ))}
                          </select>
                        </div>

                        {/* Amenities section only shows if a hotel is selected */}
                        {form.stopHotels[idx]?.name && (
                          <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: 4, border: "1px solid #eee" }}>
                            
                            <label style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, display: "block" }}>Meals Included:</label>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                              {MEAL_OPTIONS.map(meal => (
                                <label key={meal} style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                                  <input 
                                    type="checkbox" 
                                    checked={(form.stopHotels[idx]?.meals || []).includes(meal)}
                                    onChange={(e) => handleStopHotelChange(idx, "meals", { meal, checked: e.target.checked })}
                                  />
                                  {meal}
                                </label>
                              ))}
                            </div>

                            <label style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, display: "block" }}>Property Facilities:</label>
                            <div style={{ display: "flex", gap: 16 }}>
                              <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                                <input 
                                  type="checkbox" 
                                  checked={form.stopHotels[idx]?.pool || false}
                                  onChange={(e) => handleStopHotelChange(idx, "pool", e.target.checked)}
                                />
                                Swimming Pool Access, Free Wifi, Free Self Parking
                              </label>
                              <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                                <input 
                                  type="checkbox" 
                                  checked={form.stopHotels[idx]?.beach || false}
                                  onChange={(e) => handleStopHotelChange(idx, "beach", e.target.checked)}
                                />
                                Private Beach Front
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* --- END OF NEW HOTEL UI --- */}

                    </div>
                  );
                })}
              </div>

              {errors.stopsNights && (
                <p style={{ color: "red", fontSize: 12, marginTop: 8 }}>{errors.stopsNights}</p>
              )}
            </>
          )}
        </div>

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 8. Mode of Transfer Between Sightseeing Locations */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            8. Mode of transfer between sightseeing locations
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
                    {transfer.isAirportLeg && (
                      <span style={{
                        fontSize: 11, fontWeight: 500, background: "#e8f0fe",
                        color: "#1a56c4", padding: "2px 8px", borderRadius: 20,
                      }}>✈ Airport transfer</span>
                    )}
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
                    {transfer.isFixedFlight ? (
                      <div style={{
                        padding: "8px 10px", fontSize: 13, border: "1px solid #ccc",
                        borderRadius: 4, flex: 1, minWidth: 200, background: "#f0f0f0", color: "#555",
                        display: "flex", alignItems: "center", fontWeight: 500
                      }}>
                        ✈️ Locked: Flight
                      </div>
                    ) : (
                      <>
                        <select
                          value={TRANSFER_MODES.includes(transfer.mode) ? transfer.mode : ""}
                          onChange={(e) => handleTransferModeChange(transfer.key, e.target.value)}
                          style={{
                            padding: "8px 10px", fontSize: 13, border: "1px solid #ccc",
                            borderRadius: 4, flex: 1, minWidth: 200,
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
                            padding: "8px 10px", fontSize: 13, border: "1px solid #ccc",
                            borderRadius: 4, flex: 1, minWidth: 200,
                          }}
                        />
                      </>
                    )}
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

        {/* 9. Accommodation */}
        {/*Whole text was commented out because it was not needed in the final form.*/}

        {/* 9a. Total Package Cost */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="total-package-cost" style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
            9a. Total package cost (₹) <span style={{ fontWeight: 400, color: "#888", fontSize: 12 }}>— optional</span>
          </label>
          <input
            type="number"
            id="total-package-cost"
            min="0"
            placeholder="e.g. 168000"
            value={form.totalPackageCost}
            onChange={(e) => handleChange("totalPackageCost", e.target.value.replace(/[^0-9]/g, ""))}
            style={{ padding: "6px 10px", fontSize: 14, width: 200 }}
          />
          {form.totalPackageCost && (
            <p style={{ fontSize: 12, color: "#2d7a3a", marginTop: 4 }}>
              ₹ {parseInt(form.totalPackageCost, 10).toLocaleString("en-IN")}
            </p>
          )}
        </div>

        <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

        {/* 9 & 10. VISA + Travel Insurance */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>10. VISA</label>
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
            <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>11. Travel insurance</label>
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

        {/* 12. Curated By */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 8 }}>
            12. Curated by <span style={{ fontWeight: 400, color: "#888", fontSize: 12 }}>— optional</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Agent name</label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={form.agentName}
                onChange={(e) => handleChange("agentName", e.target.value)}
                style={{ padding: "6px 8px", fontSize: 13, width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Agent phone</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                value={form.agentPhone}
                onChange={(e) => handleChange("agentPhone", e.target.value)}
                style={{ padding: "6px 8px", fontSize: 13, width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Agent email</label>
              <input
                type="email"
                placeholder="e.g. agent@example.in"
                value={form.agentEmail}
                onChange={(e) => handleChange("agentEmail", e.target.value)}
                style={{ padding: "6px 8px", fontSize: 13, width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button type="submit" style={{ padding: "8px 20px", fontSize: 14, cursor: "pointer" }}>
            Submit
          </button>
          <button type="button" onClick={handleReset} style={{ padding: "8px 20px", fontSize: 14, cursor: "pointer" }}>
            Reset
          </button>
          {/* DEV ONLY */}
          <button
            type="button"
            onClick={handleAutofill}
            style={{
              padding: "8px 20px",
              fontSize: 14,
              cursor: "pointer",
              background: "#fffbeb",
              border: "1px solid #f5c842",
              borderRadius: 4,
              color: "#7a5c00",
              fontWeight: 600,
            }}
          >
            🛠 Autofill
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!submitted || !formData?.booking_id}
            style={{
              padding: "8px 20px",
              fontSize: 14,
              cursor: submitted && formData?.booking_id ? "pointer" : "not-allowed",
              opacity: submitted && formData?.booking_id ? 1 : 0.4,
            }}
          >
            Download PDF
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