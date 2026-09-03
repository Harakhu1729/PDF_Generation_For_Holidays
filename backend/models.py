"""
models.py — single source of truth for all SQLAlchemy ORM table definitions.

This module exists ONLY to break the circular import between main.py and
booking_mapper.py:

    main.py            -> needs BookingRecord (to query it)          -> imports models.py
    booking_mapper.py  -> needs BookingRecord (for the type hint)     -> imports models.py
    models.py          -> imports nothing from either of the above    -> no cycle

Neither main.py nor booking_mapper.py should EVER define a table class or
import from each other again. Both import the classes they need from here.

No engine, no session, no FastAPI app lives in this file — just Base and
the table classes — so importing it has zero side effects and can never
trigger app bootstrap code.
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class BookingRecord(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=True)
    date_of_departure = Column(String, nullable=True)
    number_of_pax = Column(Integer, nullable=True)
    number_of_adults = Column(Integer, nullable=True)
    number_of_kids = Column(Integer, nullable=True)
    number_of_infants = Column(Integer, nullable=True)
    departure_city = Column(String, nullable=True)
    arrival_airport = Column(String, nullable=True)
    return_airport = Column(String, nullable=True)
    mode_of_transfer = Column(String, nullable=True)
    visa_included = Column(String, nullable=True)
    travel_insurance_included = Column(String, nullable=True)
    total_nights = Column(Integer, nullable=True)
    total_days = Column(Integer, nullable=True)
    total_package_cost = Column(Integer, nullable=True)
    agent_name = Column(String, nullable=True)
    agent_phone = Column(String, nullable=True)
    agent_email = Column(String, nullable=True)

    # lazy="selectin" on every relationship is load-bearing for the async
    # architecture: it means AsyncSession.execute(select(BookingRecord)...)
    # eagerly loads every child collection in the SAME awaited call, so
    # accessing record.places / record.stops / etc. later inside
    # map_booking_record_to_dict() (a plain sync function) never triggers
    # an implicit lazy-load against a detached/closed async connection.
    places = relationship(
        "BookingPlace", back_populates="booking",
        cascade="all, delete-orphan", lazy="selectin",
    )
    sightseeings = relationship(
        "BookingSightseeing", back_populates="booking",
        cascade="all, delete-orphan", lazy="selectin",
    )
    booking_transfers = relationship(
        "BookingTransfer", back_populates="booking",
        cascade="all, delete-orphan", lazy="selectin",
    )
    stops = relationship(
        "BookingStop", back_populates="booking",
        cascade="all, delete-orphan", lazy="selectin",
    )


class BookingPlace(Base):
    __tablename__ = "booking_places"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    country = Column(String, nullable=False)
    places = Column(Text, nullable=False)

    booking = relationship("BookingRecord", back_populates="places")


class BookingStop(Base):
    __tablename__ = "booking_stops"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    stop_order = Column(Integer, nullable=False)
    country = Column(String, nullable=False)
    location = Column(String, nullable=False)
    nights = Column(Integer, nullable=False)
    hotel_name = Column(String, nullable=True)
    hotel_star_rating = Column(Integer, nullable=True)
    hotel_room_type = Column(String, nullable=True)
    hotel_meal_plan = Column(String, nullable=True)
    hotel_amenities = Column(String, nullable=True)

    booking = relationship("BookingRecord", back_populates="stops")


class BookingSightseeing(Base):
    __tablename__ = "booking_sightseeings"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    order_number = Column(Integer, nullable=False)
    country = Column(String, nullable=False)
    location = Column(String, nullable=False)
    sightseeing = Column(String, nullable=False)

    booking = relationship("BookingRecord", back_populates="sightseeings")


class BookingTransfer(Base):
    __tablename__ = "booking_transfers"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    from_country = Column(String, nullable=False)
    from_location = Column(String, nullable=False)
    to_country = Column(String, nullable=False)
    to_location = Column(String, nullable=False)
    mode_of_transfer = Column(String, nullable=False)

    booking = relationship("BookingRecord", back_populates="booking_transfers")