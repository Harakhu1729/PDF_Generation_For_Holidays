import sys
import asyncio
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, model_validator
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship
import json
import logging
logger = logging.getLogger(__name__)
from io import BytesIO
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
from pathlib import Path
import tempfile
from pdf_generator_playwright import render_itinerary_pdf_async
from booking_data import SAMPLE_BOOKING #for testing
from contextlib import asynccontextmanager
from playwright.async_api import async_playwright
from fastapi import Response 
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
    customer_name             = Column(String, nullable=True)
    date_of_departure         = Column(String, nullable=True)
    number_of_pax             = Column(String, nullable=True)
    number_of_adults          = Column(String, nullable=True)
    number_of_kids            = Column(String, nullable=True)
    number_of_infants         = Column(String, nullable=True)
    departure_city            = Column(String, nullable=True)
    arrival_airport           = Column(String, nullable=True) # NEW
    return_airport            = Column(String, nullable=True) # NEW
    mode_of_transfer          = Column(String, nullable=True)
    
    visa_included             = Column(String, nullable=True)
    travel_insurance_included = Column(String, nullable=True)
    # NOTE: unlike the String-typed numeric fields above (existing convention),
    # these two are real Integers on purpose — confirmed in Phase 0.2 spec,
    # because the future PDF generator needs to do date arithmetic with them.
    total_nights               = Column(Integer, nullable=True)
    total_days                 = Column(Integer, nullable=True)
    # Subtask 4.2 — new optional fields
    total_package_cost         = Column(Integer, nullable=True)   # e.g. 168000 (INR, no decimals)
    agent_name                 = Column(String,  nullable=True)
    agent_phone                = Column(String,  nullable=True)
    agent_email                = Column(String,  nullable=True)
 
    places       = relationship("BookingPlace",       back_populates="booking", cascade="all, delete-orphan")
    sightseeings = relationship("BookingSightseeing",  back_populates="booking", cascade="all, delete-orphan")
    booking_transfers = relationship("BookingTransfer", back_populates="booking", cascade="all, delete-orphan")
    stops        = relationship("BookingStop",        back_populates="booking", cascade="all, delete-orphan")
 
 
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
 
 
class BookingStop(Base):
    __tablename__ = "booking_stops"
 
    id         = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    stop_order = Column(Integer, nullable=False)   # same sequencing concept as order_number
    country    = Column(String,  nullable=False)
    location   = Column(String,  nullable=False)
    nights     = Column(Integer, nullable=False)   # NEVER null — last stop's value is saved too
 
    # NEW HOTEL COLUMNS: 
    hotel_name        = Column(String, nullable=True)
    hotel_star_rating = Column(Integer, nullable=True)
    hotel_room_type   = Column(String, nullable=True)
    hotel_meal_plan   = Column(String, nullable=True)
    hotel_amenities   = Column(String, nullable=True)
 
    booking = relationship("BookingRecord", back_populates="stops")
 
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
 
 
# ----------------------------
# TABLE 5 — booking_stops
# One row per stop in the itinerary (incl. the last stop), Phase 0.2
# ----------------------------
  
# Create all tables
Base.metadata.create_all(bind=engine)
 
 
# ----------------------------
# FASTAPI SETUP
# ----------------------------
 
app = FastAPI()
 
playwright_instance = None
browser_instance = None
 
@asynccontextmanager
async def lifespan(app: FastAPI):
    global playwright_instance, browser_instance
    print("Starting Playwright Chromium instance...")
    playwright_instance = await async_playwright().start()
    browser_instance = await playwright_instance.chromium.launch(headless=True)
    yield
    print("Shutting down Playwright...")
    await browser_instance.close()
    await playwright_instance.stop()
 
app = FastAPI(lifespan=lifespan)
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Make sure this matches your React port
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
 
 
class StopItem(BaseModel):
    stop_order: int
    country:    str
    location:   str
    nights:     int   # last stop's auto-calculated value is included too — never null
    # NEW HOTEL FIELDS (All optional since agents might skip them)
    hotel_name:        Optional[str] = None
    hotel_star_rating: Optional[int] = None
    hotel_room_type:   Optional[str] = None
    hotel_meal_plan:   Optional[str] = None
    hotel_amenities:   Optional[str] = None
 
class BookingQuery(BaseModel):
    customer_name:              Optional[str]            = None
    date_of_departure:         Optional[str]            = None
    number_of_pax:             Optional[str]            = None
    number_of_adults:          Optional[str]            = None
    number_of_kids:            Optional[str]            = None
    number_of_infants:         Optional[str]            = None
    departure_city:            Optional[str]            = None
    arrival_airport:           Optional[str]            = None # NEW
    return_airport:            Optional[str]            = None # NEW
    places_to_cover:           dict[str, list[str]]     = {}
    sightseeings:              list[SightseeingItem]    = []
    transfers:                 list[TransferItem]       = []
    total_nights:              Optional[int]            = None
    total_days:                Optional[int]            = None
    stops:                     list[StopItem]           = []
    # accommodation:             Optional[str]            = None
    visa_included:             Optional[str]            = None
    travel_insurance_included: Optional[str]            = None
    # Subtask 4.2 — new optional fields (none are required to submit)
    total_package_cost:        Optional[int]            = None
    agent_name:                Optional[str]            = None
    agent_phone:               Optional[str]            = None
    agent_email:               Optional[str]            = None
 
    @model_validator(mode="after")
    def check_required_fields(self):
        errors = {}
 
        if not self.customer_name:
            errors["customer_name"] = "Customer name is required."
 
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
 
        if self.total_nights is None:
            errors["total_nights"] = "Total nights for the trip is required."
        elif self.total_nights < 1:
            errors["total_nights"] = "Total nights must be at least 1."
 
        if self.total_days is None:
            errors["total_days"] = "Total days is required."
        elif self.total_nights is not None and self.total_days != self.total_nights + 1:
            errors["total_days"] = "Total days must equal total nights + 1."
 
        if not self.stops:
            errors["stops"] = "At least one stop with nights allocated is required."
        else:
            sorted_stops = sorted(self.stops, key=lambda s: s.stop_order)
            last_stop = sorted_stops[-1]
            for s in sorted_stops:
                if s.nights < 0:
                    errors["stops"] = "No stop can have a negative number of nights."
                    break
                if s is not last_stop and s.nights < 1:
                    errors["stops"] = "Every stop except the last must have at least 1 night."
                    break
            else:
                stops_total = sum(s.nights for s in sorted_stops)
                if self.total_nights is not None and stops_total != self.total_nights:
                    errors["stops"] = (
                        f"Nights across stops ({stops_total}) must add up to "
                        f"total nights for the trip ({self.total_nights})."
                    )
 
        # if not self.accommodation:
            # errors["accommodation"] = "Accommodation is required."
 
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
        customer_name             = payload.customer_name,
        date_of_departure         = payload.date_of_departure,
        number_of_pax             = payload.number_of_pax,
        number_of_adults          = payload.number_of_adults,
        number_of_kids            = payload.number_of_kids,
        number_of_infants         = payload.number_of_infants,
        departure_city            = payload.departure_city,
        arrival_airport           = payload.arrival_airport, # NEW
        return_airport            = payload.return_airport,  # NEW
        # accommodation             = payload.accommodation,
        visa_included             = payload.visa_included,
        travel_insurance_included = payload.travel_insurance_included,
        total_nights              = payload.total_nights,
        total_days                = payload.total_days,
        total_package_cost        = payload.total_package_cost,
        agent_name                = payload.agent_name,
        agent_phone               = payload.agent_phone,
        agent_email               = payload.agent_email,
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
 
    # Step 5 — Save each stop (incl. last stop) into booking_stops
    for s in payload.stops:
        db.add(BookingStop(
            booking_id = record.id,
            stop_order = s.stop_order,
            country    = s.country,
            location   = s.location,
            nights     = s.nights,
            # MAP NEW HOTEL DATA
            hotel_name        = s.hotel_name,
            hotel_star_rating = s.hotel_star_rating,
            hotel_room_type   = s.hotel_room_type,
            hotel_meal_plan   = s.hotel_meal_plan,
            hotel_amenities   = s.hotel_amenities,
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
 
        # Rebuild stops sorted by stop_order
        stops_list = sorted(
            [
                {
                    "stop_order": s.stop_order,
                    "country":    s.country,
                    "location":   s.location,
                    "nights":     s.nights,
                    "hotel_name":        s.hotel_name,
                    "hotel_star_rating": s.hotel_star_rating,
                    "hotel_room_type":   s.hotel_room_type,
                    "hotel_meal_plan":   s.hotel_meal_plan,
                    "hotel_amenities":   s.hotel_amenities,
                }
                for s in r.stops
            ],
            key=lambda x: x["stop_order"]
        )
 
        result.append({
            "id":                        r.id,
            "customer_name":             r.customer_name,
            "date_of_departure":         r.date_of_departure,
            "number_of_pax":             r.number_of_pax,
            "number_of_adults":          r.number_of_adults,
            "number_of_kids":            r.number_of_kids,
            "number_of_infants":         r.number_of_infants,
            "departure_city":            r.departure_city,
            "arrival_airport":           r.arrival_airport,
            "return_airport":            r.return_airport,
            "places_to_cover":           places_dict,
            "sightseeings":              sightseeings_list,
            "transfers":                 transfers_list,
            "total_nights":              r.total_nights,
            "total_days":                r.total_days,
            "stops":                     stops_list,
            #"accommodation":             # r.accommodation,
            "visa_included":             r.visa_included,
            "travel_insurance_included": r.travel_insurance_included,
            "total_package_cost":         r.total_package_cost,
            "agent_name":                 r.agent_name,
            "agent_phone":                r.agent_phone,
            "agent_email":                r.agent_email,
        })
 
    return result

@app.get("/api/bookings/{booking_id}/pdf")
async def download_booking_pdf(booking_id: int):
    db = SessionLocal()
    try:
        record = db.query(BookingRecord).filter(BookingRecord.id == booking_id).first()
        if not record:
            raise HTTPException(status_code=404, detail=f"Booking {booking_id} not found")
        
        from booking_mapper import map_booking_record_to_dict
        booking_dict = map_booking_record_to_dict(record)
        
        with tempfile.TemporaryDirectory() as tmpdir:
            temp_pdf_path = Path(tmpdir) / f"itinerary_{booking_id}.pdf"
            
            # Pass the warm global browser instance
            await render_itinerary_pdf_async(
                booking=booking_dict, 
                output_path=str(temp_pdf_path),
                browser=browser_instance,
                close_browser=False  # Keep it open for the next request!
            )
            
            pdf_bytes = temp_pdf_path.read_bytes()
 
        customer_name = booking_dict["customer_name"].replace(" ", "_")
        filename = f"{customer_name}_itinerary.pdf"
        
        # Return a standard Response for in-memory bytes
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"inline; filename={filename}"}
        )
    except Exception as e:
        logger.error(f"PDF generation failed: {str(e)}") # Good practice to log this
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
    finally:
        db.close()
if __name__ == "__main__":
    import uvicorn
    # This ensures the Proactor policy we set at the top is respected
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)