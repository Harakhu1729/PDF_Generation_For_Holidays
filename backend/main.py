from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, model_validator
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship
import json

# ----------------------------
# DATABASE SETUP
# ----------------------------

DATABASE_URL = "sqlite:///./bookings.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ----------------------------
# TABLE 1 — bookings
# ----------------------------

class BookingRecord(Base):
    __tablename__ = "bookings"

    id                        = Column(Integer, primary_key=True, index=True)
    date_of_departure         = Column(String, nullable=True)
    number_of_pax             = Column(String, nullable=True)
    number_of_adults          = Column(String, nullable=True)
    number_of_kids            = Column(String, nullable=True)
    number_of_infants         = Column(String, nullable=True)
    departure_city            = Column(String, nullable=True)
    mode_of_transfer          = Column(String, nullable=True)
    accommodation             = Column(String, nullable=True)
    visa_included             = Column(String, nullable=True)
    travel_insurance_included = Column(String, nullable=True)

    places       = relationship("BookingPlace",       back_populates="booking", cascade="all, delete-orphan")
    sightseeings = relationship("BookingSightseeing",  back_populates="booking", cascade="all, delete-orphan")
    booking_transfers = relationship("BookingTransfer", back_populates="booking", cascade="all, delete-orphan")


# ----------------------------
# TABLE 2 — booking_places
# One row per country per booking
# ----------------------------

class BookingPlace(Base):
    __tablename__ = "booking_places"

    id         = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    country    = Column(String, nullable=False)
    places     = Column(Text,   nullable=False)   # "Bangkok, Ko Samui"

    booking = relationship("BookingRecord", back_populates="places")


# ----------------------------
# TABLE 3 — booking_sightseeings
# One row per sightseeing entry per booking
# ----------------------------

class BookingSightseeing(Base):
    __tablename__ = "booking_sightseeings"

    id           = Column(Integer, primary_key=True, index=True)
    booking_id   = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    order_number = Column(Integer, nullable=False)   # position in itinerary
    country      = Column(String,  nullable=False)
    location     = Column(String,  nullable=False)
    sightseeing  = Column(String,  nullable=False)

    booking = relationship("BookingRecord", back_populates="sightseeings")


# ----------------------------
# TABLE 4 — booking_transfers
# One row per location-to-location transfer in the itinerary
# ----------------------------

class BookingTransfer(Base):
    __tablename__ = "booking_transfers"

    id               = Column(Integer, primary_key=True, index=True)
    booking_id       = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    from_country     = Column(String, nullable=False)
    from_location    = Column(String, nullable=False)
    to_country       = Column(String, nullable=False)
    to_location      = Column(String, nullable=False)
    mode_of_transfer = Column(String, nullable=False)  # e.g., "Cab", "Ferry", "Private Yacht"

    booking = relationship("BookingRecord", back_populates="booking_transfers")


# Create all tables
Base.metadata.create_all(bind=engine)


# ----------------------------
# FASTAPI SETUP
# ----------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------
# PYDANTIC MODELS
# ----------------------------

class SightseeingItem(BaseModel):
    order:      int
    country:    str
    location:   str
    sightseeing: str


class TransferItem(BaseModel):
    from_country:    str
    from_location:   str
    to_country:      str
    to_location:     str
    mode_of_transfer: str


class BookingQuery(BaseModel):
    date_of_departure:         Optional[str]            = None
    number_of_pax:             Optional[str]            = None
    number_of_adults:          Optional[str]            = None
    number_of_kids:            Optional[str]            = None
    number_of_infants:         Optional[str]            = None
    departure_city:            Optional[str]            = None
    places_to_cover:           dict[str, list[str]]     = {}
    sightseeings:              list[SightseeingItem]    = []
    transfers:                 list[TransferItem]       = []
    accommodation:             Optional[str]            = None
    visa_included:             Optional[str]            = None
    travel_insurance_included: Optional[str]            = None

    @model_validator(mode="after")
    def check_required_fields(self):
        errors = {}

        if not self.date_of_departure:
            errors["date_of_departure"] = "Date of departure is required."

        if not self.number_of_pax:
            errors["number_of_pax"] = "Number of passengers is required."

        if self.number_of_pax and int(self.number_of_pax) >= 10:
            errors["number_of_pax"] = "10 or more passengers must use Group Booking."

        if not self.number_of_adults:
            errors["number_of_adults"] = "Number of adults is required."
        elif int(self.number_of_adults) < 1:
            errors["number_of_adults"] = "Number of adults cannot be 0 or less."

        if self.number_of_kids is None or self.number_of_kids == "":
            errors["number_of_kids"] = "Number of kids is required. Enter 0 if none."
        elif int(self.number_of_kids) < 0:
            errors["number_of_kids"] = "Number of kids cannot be less than 0."

        if self.number_of_infants is None or self.number_of_infants == "":
            errors["number_of_infants"] = "Number of infants is required. Enter 0 if none."
        elif int(self.number_of_infants) < 0:
            errors["number_of_infants"] = "Number of infants cannot be less than 0."

        if not self.departure_city:
            errors["departure_city"] = "Departure city is required."

        if not self.places_to_cover:
            errors["places_to_cover"] = "At least one place to cover is required."

        if not self.sightseeings:
            errors["sightseeings"] = "At least one sightseeing is required."

        if any(not t.mode_of_transfer.strip() for t in self.transfers):
            errors["transfers"] = "Every transfer leg must have a mode of transfer."

        if not self.accommodation:
            errors["accommodation"] = "Accommodation is required."

        if self.visa_included not in ("true", "false"):
            errors["visa_included"] = "VISA preference is required."

        if self.travel_insurance_included not in ("true", "false"):
            errors["travel_insurance_included"] = "Travel insurance preference is required."

        if errors:
            raise ValueError(errors)

        return self


# ----------------------------
# DEPENDENCY — DB SESSION
# ----------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------------
# ROUTES
# ----------------------------

@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/api/booking-query")
async def create_booking_query(
    payload: BookingQuery,
    db: Session = Depends(get_db)
):
    # Step 1 — Save main booking row
    record = BookingRecord(
        date_of_departure         = payload.date_of_departure,
        number_of_pax             = payload.number_of_pax,
        number_of_adults          = payload.number_of_adults,
        number_of_kids            = payload.number_of_kids,
        number_of_infants         = payload.number_of_infants,
        departure_city            = payload.departure_city,
        accommodation             = payload.accommodation,
        visa_included             = payload.visa_included,
        travel_insurance_included = payload.travel_insurance_included,
    )
    db.add(record)
    db.flush()  # get booking id before commit

    # Step 2 — Save one row per country into booking_places
    for country, places_list in payload.places_to_cover.items():
        if places_list:
            db.add(BookingPlace(
                booking_id = record.id,
                country    = country,
                places     = ", ".join(places_list),
            ))

    # Step 3 — Save each sightseeing tablet into booking_sightseeings
    for s in payload.sightseeings:
        db.add(BookingSightseeing(
            booking_id   = record.id,
            order_number = s.order,
            country      = s.country,
            location     = s.location,
            sightseeing  = s.sightseeing,
        ))

    # Step 4 — Save each transfer between locations into booking_transfers
    for t in payload.transfers:
        db.add(BookingTransfer(
            booking_id       = record.id,
            from_country     = t.from_country,
            from_location    = t.from_location,
            to_country       = t.to_country,
            to_location      = t.to_location,
            mode_of_transfer = t.mode_of_transfer,
        ))

    db.commit()
    db.refresh(record)

    return {
        "status":     "success",
        "booking_id": record.id,
        "received":   payload,
    }


@app.get("/api/bookings")
def get_all_bookings(db: Session = Depends(get_db)):
    records = db.query(BookingRecord).all()

    result = []
    for r in records:

        # Rebuild places dict: { "Thailand": ["Bangkok", "Ko Samui"] }
        places_dict = {}
        for p in r.places:
            places_dict[p.country] = [
                place.strip() for place in p.places.split(",")
            ]

        # Rebuild sightseeings sorted by order_number
        sightseeings_list = sorted(
            [
                {
                    "order":      s.order_number,
                    "country":    s.country,
                    "location":   s.location,
                    "sightseeing": s.sightseeing,
                }
                for s in r.sightseeings
            ],
            key=lambda x: x["order"]
        )

        # Rebuild transfers as a list
        transfers_list = [
            {
                "from_country":    t.from_country,
                "from_location":   t.from_location,
                "to_country":      t.to_country,
                "to_location":     t.to_location,
                "mode_of_transfer": t.mode_of_transfer,
            }
            for t in r.booking_transfers if hasattr(r, 'booking_transfers')
        ]

        result.append({
            "id":                        r.id,
            "date_of_departure":         r.date_of_departure,
            "number_of_pax":             r.number_of_pax,
            "number_of_adults":          r.number_of_adults,
            "number_of_kids":            r.number_of_kids,
            "number_of_infants":         r.number_of_infants,
            "departure_city":            r.departure_city,
            "places_to_cover":           places_dict,
            "sightseeings":              sightseeings_list,
            "transfers":                 transfers_list,
            "accommodation":             r.accommodation,
            "visa_included":             r.visa_included,
            "travel_insurance_included": r.travel_insurance_included,
        })

    return result
