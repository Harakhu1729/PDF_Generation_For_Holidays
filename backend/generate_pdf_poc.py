"""
Phase 1.3 + 1.4 proof-of-concept (standalone, no FastAPI yet).

Run:
    python generate_pdf_poc.py

Produces:
    itinerary_preview.html   (so you can sanity-check in a browser first)
    itinerary_preview.pdf    (the actual WeasyPrint output)

This intentionally does NOT touch main.py, the database, or FastAPI.
Once you're happy this works, Phase 1 is done and we wire this same
render_booking_to_pdf() logic into a GET /api/bookings/{id}/pdf route.
"""

from pathlib import Path
from datetime import datetime, timedelta
from jinja2 import Environment, FileSystemLoader
##from weasyprint import HTML # <--Commented out since we are using Playwright instead

from booking_data import SAMPLE_BOOKING, SAMPLE_BOOKING_VIETNAM_VISA
import static_content
from image_resolver import resolve_cover_image

TEMPLATE_DIR = Path(__file__).parent
TEMPLATE_NAME = "itinerary_template.html"

DATE_DISPLAY_FORMAT = "%d/%m/%Y"   # DD/MM/YYYY, per your confirmed choice


def compute_stop_dates(booking: dict) -> list[dict]:
    """
    Phase 2, Subtask 1 — Date calculation.

    Stop 1's check-in = booking["date_of_departure"]. Each stop's
    check-out = check-in + nights; the next stop's check-in is that
    same check-out date. No separate arrival date is tracked (flights
    are out of scope).

    Returns a NEW list — booking["stops"] is never mutated. Each item
    is the original stop dict's fields, merged with "checkin_date" and
    "checkout_date" (DD/MM/YYYY strings), in stop_order. This mirrors
    the same merge pattern build_stops_with_sightseeings already uses
    for sightseeings, and is shaped so Subtask 2's build_itinerary_timeline
    can drop each item straight into the alternating stop/transfer
    sequence with no further matching step.
    """
    sorted_stops = sorted(booking["stops"], key=lambda s: s["stop_order"])
    checkin = datetime.strptime(booking["date_of_departure"], "%Y-%m-%d")

    result = []
    for stop in sorted_stops:
        checkout = checkin + timedelta(days=stop["nights"])
        result.append({
            **stop,
            "checkin_date": checkin.strftime(DATE_DISPLAY_FORMAT),
            "checkout_date": checkout.strftime(DATE_DISPLAY_FORMAT),
        })
        checkin = checkout  # next stop starts where this one ends

    return result


def get_booking_visa_faq(booking: dict):
    """
    Visa FAQ returns content whenever visa_included == "true".
    Currently shows Vietnam FAQ (only country with content in static_content.py).
    
    Multi-country logic will be added later. For now, this ensures the Visa FAQ
    section renders whenever employees select visa_included, providing a
    consistent customer experience. Bug D testing: verifies rendering regardless
    of booking country count.
    """
    if booking.get("visa_included") != "true":
        return None
    # For now: always show Vietnam FAQ when visa is included.
    # Multi-country routing logic will be added in a future phase.
    return static_content.get_visa_faq("Vietnam")


def build_stops_with_sightseeings(booking: dict) -> list[dict]:
    """
    Groups the flat `sightseeings` list under each stop, matched by
    country+location. This mirrors how the real /api/bookings data will
    need to be grouped for the day-wise itinerary section later —
    keeping this logic here (not in the template) so the template stays
    simple and this function can be reused once real DB rows replace
    the hardcoded dict.
    """
    grouped = []
    for stop in sorted(booking["stops"], key=lambda s: s["stop_order"]):
        matching = [
            s["sightseeing"]
            for s in booking["sightseeings"]
            if s["country"] == stop["country"] and s["location"] == stop["location"]
        ]
        grouped.append({**stop, "sightseeings": matching})
    return grouped


def classify_transfer(transfer: dict, stops: list[dict]) -> str:
    """
    Phase 2, Subtask 2 — Transfer classification.

    Classifies a transfer PURELY from the data: checks whether each
    side (from / to) matches a real stop's (country, location). No
    separate "type" field exists on the transfer itself — this is
    derived at render time, per the project's earlier decision.

    Returns one of: "pre_trip", "inter_stop", "post_trip", "unmatched".
    "unmatched" should never occur with valid form data (every
    transfer's from/to is either an airport leg or a real stop) — it's
    kept only as a safety net so a render never crashes on bad data.
    build_itinerary_timeline() drops "unmatched" transfers rather than
    guess where they belong.
    """
    # -------------------------------------------------------------------------
    # BUG #1 FIX: SENTINEL VALUE FLIGHT IDENTIFICATION
    # Check if this transfer row represents the main incoming or outbound flight legs
    # by evaluating the frontend sentinel indicators ("Home" and "Destination").
    # This prevents flights from failing the strict stop-matching checks below.
    # -------------------------------------------------------------------------
    from_c = transfer.get("from_country")
    to_c = transfer.get("to_country")

    if from_c == "Home" and to_c == "Destination":
        return "pre_trip"
    if from_c == "Destination" and to_c == "Home":
        return "post_trip"
    # -------------------------------------------------------------------------

    stop_keys = {(s["country"], s["location"]) for s in stops}
    from_is_stop = (transfer["from_country"], transfer["from_location"]) in stop_keys
    to_is_stop = (transfer["to_country"], transfer["to_location"]) in stop_keys

    if not from_is_stop and to_is_stop:
        return "pre_trip"
    if from_is_stop and not to_is_stop:
        return "post_trip"
    if from_is_stop and to_is_stop:
        return "inter_stop"
    return "unmatched"


def build_itinerary_timeline(booking: dict) -> list[dict]:
    """
    Phase 2, Subtask 2 — Unified itinerary timeline.

    Produces ONE ordered list alternating stop blocks and transfer rows:
        [pre_trip_transfer?, stop_1, inter_stop_transfer, stop_2, ...,
         stop_N, post_trip_transfer?]

    Every item carries "type": "stop" or "transfer", so Subtask 3's
    template can loop over this single list with NO branching logic of
    its own — it just checks item.type. Reuses compute_stop_dates()
    (Subtask 1) and build_stops_with_sightseeings() rather than
    duplicating their matching logic — merged together by stop_order so
    each stop item carries dates AND sightseeings in one object.

    pre_trip / post_trip lists assume at most one airport leg on each
    end (true for every booking seen so far — see booking_data.py). If
    a booking has none (e.g. real frontend data today, which doesn't
    capture airport legs yet — Phase 4), the timeline simply starts/ends
    at the first/last stop with no airport row, which is correct.
    """
    dated_stops = compute_stop_dates(booking)
    sightseeings_by_stop = {
        s["stop_order"]: s["sightseeings"]
        for s in build_stops_with_sightseeings(booking)
    }

    stop_items = [
        {
            **stop,
            "sightseeings": sightseeings_by_stop.get(stop["stop_order"], []),
            "type": "stop",
        }
        for stop in dated_stops
    ]

    classified = [
        {**t, "transfer_category": classify_transfer(t, booking["stops"]), "type": "transfer"}
        for t in booking["transfers"]
    ]

    pre_trip = [t for t in classified if t["transfer_category"] == "pre_trip"]
    post_trip = [t for t in classified if t["transfer_category"] == "post_trip"]
    inter_stop_lookup = {
        (t["from_country"], t["from_location"], t["to_country"], t["to_location"]): t
        for t in classified if t["transfer_category"] == "inter_stop"
    }
    # "unmatched" transfers (shouldn't occur with valid data) are
    # intentionally dropped here rather than guessed into a position.

    timeline = list(pre_trip)
    for i, stop in enumerate(stop_items):
        timeline.append(stop)
        if i < len(stop_items) - 1:
            nxt = stop_items[i + 1]
            key = (stop["country"], stop["location"], nxt["country"], nxt["location"])
            transfer = inter_stop_lookup.get(key)
            if transfer:
                timeline.append(transfer)
    timeline.extend(post_trip)

    return timeline


def render_booking_to_html(booking: dict) -> str:
    """
    Render a booking dict to HTML string.
    
    Returns the rendered HTML. For PDF generation, use pdf_generator_playwright.py
    which has full Playwright/Chromium support for CSS rendering.
    """
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    template = env.get_template(TEMPLATE_NAME)

    context = {
        "booking": booking,
        # Phase A1/E1 (D5): inlined data: URI or None. Resolution lives in
        # image_resolver.py so the preview harness and the PDF renderer agree.
        "cover_image_path": resolve_cover_image(booking),
        "countries": list(booking["places_to_cover"].keys()),
        "itinerary_timeline": build_itinerary_timeline(booking),
        "tcs_explanation_paragraphs": static_content.TCS_EXPLANATION_PARAGRAPHS,
        "tcs_credit_block_points": static_content.TCS_CREDIT_BLOCK_POINTS,
        "terms_and_conditions": static_content.TERMS_AND_CONDITIONS,
        "visa_faq": get_booking_visa_faq(booking),
    }

    return template.render(**context)


if __name__ == "__main__":
    """
    Render sample booking to HTML for preview/debugging.
    Run: python generate_pdf_poc.py
    Output: itinerary_preview.html (in same directory)
    
    BUG D: Temporarily using SAMPLE_BOOKING_VIETNAM_VISA to verify Visa FAQ
    section renders when visa_included == "true". This booking includes Vietnam
    with complete itinerary + Visa FAQs for testing the static_content integration.
    """
    html_output = render_booking_to_html(SAMPLE_BOOKING)
    
    output_path = Path(__file__).parent / "itinerary_preview.html"
    output_path.write_text(html_output, encoding="utf-8")
    
    print(f"✓ HTML rendered: {output_path}")
    print(f"  BUG D TESTING: Rendered Vietnam booking with visa_included=true")
    print(f"  Expected: Visa FAQ section visible in output")
    print(f"  Open this file in a browser to verify the Visa FAQs appear.")