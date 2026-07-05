"""
Subtasks 4.1 + 4.2 — DB row -> booking_dict mapping function.

Converts a real BookingRecord (with its SQLAlchemy relationships already
loaded) into the exact dict shape render_booking_to_pdf() expects,
matching booking_data.py's SAMPLE_BOOKING shape.

All 5 previously-stubbed fields are now real (Subtask 4.2):
  - total_package_cost / _display / _pax_label : pulled from the new
    DB column + computed from existing pax columns at mapping time.
  - quotation_created_on : generated fresh via datetime.now() at the
    moment map_booking_record_to_dict() is called (refresh-on-download).
  - curated_by : pulled from the new agent_name / agent_phone /
    agent_email columns; falls back to empty string if not entered.

Airport <-> hotel transfer legs arrive as ordinary booking_transfer rows
(same table as inter-stop transfers) — no special handling needed here.
"""

from datetime import datetime
from main import BookingRecord



# ---------------------------------------------------------------------------
# Private helpers — used only by map_booking_record_to_dict() below
# ---------------------------------------------------------------------------

def _format_inr(amount: int | None) -> str:
    """
    Format an integer INR amount in Indian numbering style.
    e.g. 168000 -> "₹ 1,68,000"   |   None -> "TBD"
    """
    if amount is None:
        return "TBD"
    s = str(int(amount))
    # Indian grouping: last 3 digits, then every 2
    if len(s) <= 3:
        return f"₹ {s}"
    last3 = s[-3:]
    rest  = s[:-3]
    groups = []
    while len(rest) > 2:
        groups.append(rest[-2:])
        rest = rest[:-2]
    if rest:
        groups.append(rest)
    groups.reverse()
    return f"₹ {','.join(groups)},{last3}"


def _build_pax_label(
    total_pax: str | None,
    adults: str | None,
    kids: str | None,
    infants: str | None,
) -> str:
    """
    Build a compact pax label matching booking_data.py's convention.
    e.g. "4 (2 Adults, 2 Kids)"  or  "3 (3 Adults)"
    Falls back to "TBD" if data is missing (all four args are None/empty).
    """
    # If we have no data at all, return TBD rather than "0"
    if all(v is None or v == "" for v in (total_pax, adults, kids, infants)):
        return "TBD"
    try:
        n_adults  = int(adults  or 0)
        n_kids    = int(kids    or 0)
        n_infants = int(infants or 0)
        total     = int(total_pax) if total_pax else (n_adults + n_kids + n_infants)
    except (ValueError, TypeError):
        return "TBD"

    parts = []
    if n_adults  > 0: parts.append(f"{n_adults} Adult{'s' if n_adults != 1 else ''}")
    if n_kids    > 0: parts.append(f"{n_kids} Kid{'s' if n_kids != 1 else ''}")
    if n_infants > 0: parts.append(f"{n_infants} Infant{'s' if n_infants != 1 else ''}")

    if not parts:
        return str(total)
    return f"{total} ({', '.join(parts)})"


def map_booking_record_to_dict(record: BookingRecord) -> dict:
    # --- places_to_cover: { "Vietnam": ["Ho Chi Minh City", "Hoi An"] } ---
    places_dict = {}
    for p in record.places:
        places_dict[p.country] = [place.strip() for place in p.places.split(",")]

    # --- sightseeings, sorted by order_number (same shape as booking_data.py) ---
    sightseeings_list = sorted(
        [
            {
                "order": s.order_number,
                "country": s.country,
                "location": s.location,
                "sightseeing": s.sightseeing,
            }
            for s in record.sightseeings
        ],
        key=lambda x: x["order"],
    )

    # --- transfers (includes any airport<->hotel legs once those exist) ---
    transfers_list = [
        {
            "from_country": t.from_country,
            "from_location": t.from_location,
            "to_country": t.to_country,
            "to_location": t.to_location,
            "mode_of_transfer": t.mode_of_transfer,
        }
        for t in record.booking_transfers
    ]

    # --- stops, sorted by stop_order ---
    stops_list = sorted(
        [
            {
                "stop_order": s.stop_order,
                "country": s.country,
                "location": s.location,
                "nights": s.nights,
                # NEW: Hotel details mapping
                "hotel_name": s.hotel_name or "",
                "hotel_star_rating": s.hotel_star_rating or 0,
                "hotel_room_type": s.hotel_room_type or "",
                "hotel_meal_plan": s.hotel_meal_plan or "",
                "hotel_amenities": [
                    a.strip() for a in (s.hotel_amenities or "").split(",") if a.strip()
                ],
            }
            for s in record.stops
        ],
        key=lambda x: x["stop_order"],
    )

    return {
        "id": record.id,
        "customer_name": record.customer_name,
        "date_of_departure": record.date_of_departure,
        "number_of_pax": record.number_of_pax,
        "number_of_adults": record.number_of_adults,
        "number_of_kids": record.number_of_kids,
        "number_of_infants": record.number_of_infants,
        "departure_city": record.departure_city,
        "arrival_airport": record.arrival_airport,
        "return_airport": record.return_airport,
        "places_to_cover": places_dict,
        "sightseeings": sightseeings_list,
        "transfers": transfers_list,
        "total_nights": record.total_nights,
        "total_days": record.total_days,
        "stops": stops_list,
        #"accommodation": record.accommodation,
        "visa_included": record.visa_included,
        "travel_insurance_included": record.travel_insurance_included,

        # ----- Subtask 4.2: real values (no more stubs) -----

        # total_package_cost: stored as plain integer (INR, no decimals).
        # _display formats it as Indian-style currency string if present.
        # _pax_label builds e.g. '4 (2 Adults, 2 Kids, 0 Infants)' from
        # existing pax columns so no extra DB column is needed.
        "total_package_cost": record.total_package_cost,
        "total_package_cost_display": _format_inr(record.total_package_cost),
        "total_package_cost_pax_label": _build_pax_label(
            record.number_of_pax,
            record.number_of_adults,
            record.number_of_kids,
            record.number_of_infants,
        ),

        # Generated fresh at the moment this function is called.
        # Every PDF download shows the current timestamp (refresh-on-download).
        "quotation_created_on": datetime.now().strftime("%d %b %Y, %I:%M %p"),

        # Agent details: optional, fall back to empty string if not captured.
        "curated_by": {
            "name":  record.agent_name  or "",
            "phone": record.agent_phone or "",
            "email": record.agent_email or "",
        },
    }
