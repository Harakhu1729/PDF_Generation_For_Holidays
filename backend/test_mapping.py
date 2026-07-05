from main import SessionLocal, BookingRecord
from booking_mapper import map_booking_record_to_dict
from generate_pdf_poc import render_booking_to_pdf

db = SessionLocal()
record = db.query(BookingRecord).filter(BookingRecord.id == 1).first()
assert record is not None, "Seeded booking id=1 not found -- run seed_booking.py first"

booking_dict = map_booking_record_to_dict(record)

import json
print("--- mapped booking_dict ---")
print(json.dumps(booking_dict, indent=2))

render_booking_to_pdf(booking_dict, "test_output_4_2.pdf")
print("--- PDF generated: test_output_4_2.pdf ---")

db.close()
