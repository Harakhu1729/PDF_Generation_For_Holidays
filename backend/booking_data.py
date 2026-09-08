"""
Phase 1.2 — Hardcoded booking dictionary.
 
Rules followed (per project spec):
- No API calls. No database reads. No PDF styling decisions here.
- Shape mirrors exactly what GET /api/bookings/{id} will eventually return,
  so swapping this dict for a real DB row later (Phase 4) needs no template
  rewrite — only the data source changes.
- Includes the 4 newly-approved fields that don't exist in the DB/frontend
  yet: total_package_cost, quotation_created_on, curated_by, and the
  airport<->hotel transfer legs (added as two extra rows inside the SAME
  `transfers` list that already holds sightseeing-to-sightseeing legs —
  per your decision, no separate table/section).
- Sample scenario: a single-country (Thailand) booking, since the approved
  Visa FAQ static section only applies to single-country bookings — this
  keeps the sample realistic for the next phase that will need it.
"""
 
SAMPLE_BOOKING = {
    # ----- existing fields (already in BookingRecord / /api/bookings) -----
    "id": 1,
    "customer_name": "Aarav Mehta",
    "date_of_departure": "2026-08-07",
    "number_of_pax": "4",
    "number_of_adults": "2",
    "number_of_kids": "2",
    "number_of_infants": "0",
    "departure_city": "Indira Gandhi International Airport (DEL) — New Delhi",
    "arrival_airport": "Phuket International Airport (HKT) — Phuket",
    "return_airport": "Suvarnabhumi Airport (BKK) — Bangkok",
    "places_to_cover": {
        "Thailand": ["Phuket", "Krabi"],
    },
 
    "sightseeings": [
        {"order": 1, "country": "Thailand", "location": "Krabi",  "sightseeing": "Krabi 4 Island Tour"},
        {"order": 1, "country": "Thailand", "location": "Krabi",  "sightseeing": "Phra Nang Cave Beach Visit"},
        {"order": 2, "country": "Thailand", "location": "Phuket", "sightseeing": "Phi Phi Island Tour by Big Boat"},
        {"order": 2, "country": "Thailand", "location": "Phuket", "sightseeing": "Patong Beach Evening"},
    ],
 
    # Sightseeing-to-sightseeing transfer PLUS the two airport<->hotel legs
    # added as ordinary rows in the same list, per the agreed approach.
    "transfers": [
        {
            "from_country": "Thailand", "from_location": "Phuket Airport",
            "to_country": "Thailand",   "to_location": "Krabi",
            "mode_of_transfer": "Private Cab",
        },
        {
            "from_country": "Thailand", "from_location": "Krabi",
            "to_country": "Thailand",   "to_location": "Phuket",
            "mode_of_transfer": "Private Cab",
        },
        {
            "from_country": "Thailand", "from_location": "Phuket",
            "to_country": "Thailand",   "to_location": "Phuket Airport",
            "mode_of_transfer": "Private Cab",
        },
    ],
 
    "total_nights": 5,
    "total_days": 6,
 
    "stops": [
        {
            "stop_order": 1,
            "country": "Thailand",
            "location": "Krabi",
            "nights": 2,
            "hotel_name": "Railay Bay Resort & Spa",
            "hotel_star_rating": 4,
            "hotel_room_type": "Deluxe Room",
            "hotel_meal_plan": "Breakfast, Dinner",
            "hotel_amenities": ["Swimming Pool Access", "Free Wifi", "Beachfront Access"],
        },
        {
            "stop_order": 2,
            "country": "Thailand",
            "location": "Phuket",
            "nights": 3,
            "hotel_name": "The Pavilion Hotel",
            "hotel_star_rating": 5,
            "hotel_room_type": "Suite",
            "hotel_meal_plan": "Breakfast, Lunch, Dinner",
            "hotel_amenities": ["Swimming Pool Access", "Private Beach Front", "Spa Services"],
        },
    ],
    "visa_included": "false",
    "travel_insurance_included": "true",
 
    # ----- newly-approved fields (not yet in DB/frontend — Phase 1.2 only) -----
 
    # Single aggregate figure + pax label, matching MMT's "Total cost" block exactly.
    "total_package_cost": 168000,
    "total_package_cost_display": "₹ 1,68,000",
    "total_package_cost_pax_label": "4 (2 Adults, 2 Kids)",
 
    "quotation_created_on": "24 Jun 2026, 03:15 PM",
 
    "curated_by": {
        "name": "Sample Holidays Agent",
        "phone": "9876543210",
        "email": "agent.name@example-ota.in",
    },
    # These MUST sit at booking top level, not inside curated_by — the
    # template reads them as booking.cover_departure_date_display etc.
    # Jinja2 resolves a missing key to Undefined and renders "" silently,
    # so a nesting mistake here produces a blank cover page with no error.

    # Phase A2: cover page display fields
    "cover_departure_date_display": "07 Aug 2026",
    "cover_departure_city_display": "New Delhi (DEL)",
    "cover_arrival_airport_display": "Phuket (HKT)",
    "cover_return_airport_display": "Bangkok (BKK)",    
    
}


# ============================================================================
# SAMPLE_BOOKING_VIETNAM_VISA — Bug D Testing
# ============================================================================
# Created for Bug D verification: tests that Visa FAQ section renders when
# visa_included: "true", regardless of countries (single or multi).
# Complete Vietnam itinerary: Hanoi (2N) + Hoi An (3N) = 5N/6D

SAMPLE_BOOKING_VIETNAM_VISA = {
    # ----- existing fields (already in BookingRecord / /api/bookings) -----
    "id": 2,
    "customer_name": "Priya Sharma",
    "date_of_departure": "2026-09-15",
    "number_of_pax": "3",
    "number_of_adults": "2",
    "number_of_kids": "1",
    "number_of_infants": "0",
    "departure_city": "Chhatrapati Shivaji Maharaj International Airport (BOM) — Mumbai",
    "arrival_airport": "Noi Bai International Airport (HAN) — Hanoi",
    "return_airport": "Noi Bai International Airport (HAN) — Hanoi",

    "places_to_cover": {
        "Vietnam": ["Hanoi", "Hoi An"],
    },

    "sightseeings": [
        {"order": 1, "country": "Vietnam", "location": "Hanoi",  "sightseeing": "Hoan Kiem Lake & Old Quarter Walking Tour"},
        {"order": 1, "country": "Vietnam", "location": "Hanoi",  "sightseeing": "Temple of Literature Visit"},
        {"order": 1, "country": "Vietnam", "location": "Hanoi",  "sightseeing": "Vietnamese Street Food Cooking Class"},
        {"order": 2, "country": "Vietnam", "location": "Hoi An", "sightseeing": "Ancient Town Exploration & Photo Tour"},
        {"order": 2, "country": "Vietnam", "location": "Hoi An", "sightseeing": "Lantern-Making Workshop"},
        {"order": 2, "country": "Vietnam", "location": "Hoi An", "sightseeing": "Thu Bon River Sunset Cruise"},
    ],

    # Transfer chain: airport → Hanoi hotel → Hoi An hotel → airport
    "transfers": [
        {
            "from_country": "Vietnam", "from_location": "Noi Bai International Airport (HAN)",
            "to_country": "Vietnam",   "to_location": "Hanoi",
            "mode_of_transfer": "Private Car",
        },
        {
            "from_country": "Vietnam", "from_location": "Hanoi",
            "to_country": "Vietnam",   "to_location": "Hoi An",
            "mode_of_transfer": "Flight",
        },
        {
            "from_country": "Vietnam", "from_location": "Hoi An",
            "to_country": "Vietnam",   "to_location": "Noi Bai International Airport (HAN)",
            "mode_of_transfer": "Private Car",
        },
    ],

    "total_nights": 5,
    "total_days": 6,

    "stops": [
        {
            "stop_order": 1,
            "country": "Vietnam",
            "location": "Hanoi",
            "nights": 2,
            "hotel_name": "Hanoi Old Quarter Heritage Hotel",
            "hotel_star_rating": 4,
            "hotel_room_type": "Normal 2 Adults in 1 room occupancy",
            "hotel_meal_plan": "Breakfast, Dinner",
            "hotel_amenities": ["Swimming Pool Access"],
        },
        {
            "stop_order": 2,
            "country": "Vietnam",
            "location": "Hoi An",
            "nights": 3,
            "hotel_name": "Hoi An Riverside Boutique Resort",
            "hotel_star_rating": 5,
            "hotel_room_type": "VIP Suite",
            "hotel_meal_plan": "Breakfast, Lunch, Dinner",
            "hotel_amenities": ["Private Beach Front"],
        },
    ],
    "visa_included": "true",
    "travel_insurance_included": "true",

    # ----- newly-approved fields (not yet in DB/frontend — Phase 1.2 only) -----

    "total_package_cost": 145000,
    "total_package_cost_display": "₹ 1,45,000",
    "total_package_cost_pax_label": "3 (2 Adults, 1 Kid)",

    "quotation_created_on": "15 Sep 2026, 02:30 PM",

    "curated_by": {
        "name": "Priya Holidays Specialist",
        "phone": "9988776655",
        "email": "priya.specialist@example-ota.in",
    },
    # ----- Phase A2: cover page display fields (TOP-LEVEL keys) -----
    # See the note on SAMPLE_BOOKING above — same nesting trap applies.
    "cover_departure_date_display": "15 Sep 2026",
    "cover_departure_city_display": "Mumbai (BOM)",
    "cover_arrival_airport_display": "Hanoi (HAN)",
    "cover_return_airport_display": "Hanoi (HAN)",
    
}