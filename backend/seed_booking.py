"""
Subtasks 4.1 + 4.2 — test-only seed script.

Inserts ONE realistic booking directly into bookings.db via SQLAlchemy,
bypassing the FastAPI endpoint entirely. This is throwaway test tooling
to give booking_mapper.py a real DB row to map from — it is NOT part
of the shipped app and won't be wired into main.py.

Run:
    python seed_booking.py
"""

from main import (
    SessionLocal, BookingRecord, BookingPlace, BookingSightseeing,
    BookingTransfer, BookingStop,
)

db = SessionLocal()

record = BookingRecord(
    customer_name="Riya Kapoor",
    date_of_departure="2026-09-12",
    number_of_pax="3",
    number_of_adults="2",
    number_of_kids="1",
    number_of_infants="0",
    departure_city="Kempegowda International Airport (BLR) — Bengaluru",
    accommodation="3-Star Hotel",
    visa_included="true",
    travel_insurance_included="false",
    total_nights=4,
    total_days=5,
    # Subtask 4.2 — new fields
    total_package_cost=85000,
    agent_name="Priya Sharma",
    agent_phone="9876543210",
    agent_email="priya.sharma@example-ota.in",
)
db.add(record)
db.flush()  # need record.id before adding child rows

db.add(BookingPlace(
    booking_id=record.id,
    country="Vietnam",
    places="Ho Chi Minh City, Hoi An",
))

sightseeings = [
    (1, "Vietnam", "Ho Chi Minh City", "Cu Chi Tunnels Tour"),
    (1, "Vietnam", "Ho Chi Minh City", "City Tour"),
    (2, "Vietnam", "Hoi An", "Ancient Town Walking Tour"),
    (2, "Vietnam", "Hoi An", "Lantern Boat Ride"),
]
for order, country, location, sightseeing in sightseeings:
    db.add(BookingSightseeing(
        booking_id=record.id,
        order_number=order,
        country=country,
        location=location,
        sightseeing=sightseeing,
    ))

db.add(BookingTransfer(
    booking_id=record.id,
    from_country="Vietnam", from_location="Ho Chi Minh City",
    to_country="Vietnam", to_location="Hoi An",
    mode_of_transfer="Flight",
))

stops = [
    (1, "Vietnam", "Ho Chi Minh City", 2),
    (2, "Vietnam", "Hoi An", 2),
]
for stop_order, country, location, nights in stops:
    db.add(BookingStop(
        booking_id=record.id,
        stop_order=stop_order,
        country=country,
        location=location,
        nights=nights,
    ))

db.commit()
print(f"Seeded booking id = {record.id}")
db.close()
