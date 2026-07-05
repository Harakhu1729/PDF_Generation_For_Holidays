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
        {"stop_order": 1, "country": "Thailand", "location": "Krabi",  "nights": 2},
        {"stop_order": 2, "country": "Thailand", "location": "Phuket", "nights": 3},
    ],

    "accommodation": "4-Star Resort",
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
}
