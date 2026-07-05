"""
Phase 3 — Static boilerplate content for the itinerary PDF.

Kept as plain Python data, SEPARATE from itinerary_template.html and
booking_data.py — same separation pattern booking_data.py already uses
for the per-booking data. Editing wording later should never require
touching HTML/CSS.

SOURCE: real company-approved EaseMyTrip-style T&Cs / TCS / Visa FAQ
copy, supplied directly. Do NOT edit the wording below without explicit
sign-off — this is real legal/customer-facing content, not placeholder
text.

CANCELLATION POLICY — DELIBERATELY NOT INCLUDED HERE.
Confirmed (Phase 3): no standalone generic Cancellation Policy document
exists at the company. This is a known, flagged gap — not an oversight.
The template intentionally renders no "Cancellation Policy" section
rather than show a fake/empty placeholder to a real customer. Revisit
if/when a generic policy doc is created.
"""

# ----------------------------------------------------------------------
# TCS explanation block — plain paragraphs, renders for every booking
# (every booking on this tool is an international travel package).
# ----------------------------------------------------------------------

TCS_EXPLANATION_PARAGRAPHS = [
    "TCS is mandatory for International Travel Packages",
    "20% TCS is applicable on individual transactions above Rs. 10,00,000 per annum",
    (
        "As per Union Budget 2025, 5% TCS will be applicable on International "
        "travel packages up to Rs. 10,00,000 (excluding TCS) against each PAN "
        "in a financial year (FY). Above this limit, TCS will be applicable at "
        "20% on the incremental amount."
    ),
    (
        "TCS is neither a cost nor additional tax, it can be fully adjusted "
        "against income tax liability and excess, if any, can be claimed as a "
        "refund."
    ),
]


# ----------------------------------------------------------------------
# TCS credit block — bullet points, renders for every booking.
# ----------------------------------------------------------------------

TCS_CREDIT_BLOCK_POINTS = [
    (
        "TCS credit would reflect in your Form 26AS on quarterly basis. You "
        "may also request a TCS certificate from EMT."
    ),
    "Charged TCS can be claimed against the tax payable at the time of filing the return.",
    (
        "In case there is no tax payable, you can claim the refund of TCS "
        "amount at the time of filing income tax return."
    ),
]


# ----------------------------------------------------------------------
# Terms & Conditions — bullet points, renders for every booking.
# ----------------------------------------------------------------------

TERMS_AND_CONDITIONS = [
    "Above given quote is valid for 72 Hours. Please ask for a new quotation if the booking is not made within 72 Hours.",
    "Above given quote is tentative and is subject to change depending on the availabilities along with prices at the time of making the advance payment ahead.",
    "Rate of Exchange will be calculated XE.com + 2 Rs.",
    "Any change in Pricing, Hotels, Sightseeing's & Airlines due to the availability or unforeseen circumstances, will be conveyed to you within 24 hours after you have paid the booking amount.",
    "Payments against your package strictly has to be paid as per the payment conditions mentioned if the payment is not made accordingly, we may have to cancel all your services / bookings.",
    "Booking Amount is Non-Refundable",
    "Please make sure your Passport is valid for minimum 6 months from date of return to India.",
    "Issuance or delay of your visa will be sole discretion of embassy and EaseMyTrip will not be responsible for the same. If your visa gets rejected or delayed embassy's end the cancellation will be applicable as per the cancellation policy.",
    "As per the new Govt. Norms 20% TCS is applicable from 1st Oct 2023 on all the payments made, if your total billing of overseas travel exceeds 7 Lakhs in a financial year. For any further clarification please contact your sale's agent. Please note we require your Signature on TCS Declaration form at the time of booking, same has to be sent back to us with your signatures on the same. If TCS Declaration form is not shared by the sale's agent with you at the time of booking, please ask for the same.",
    "City Tax if applicable is directly payable at the hotel.",
    "Your tour package will start after reaching the destination, we will not be providing any services within India.",
    "Check-in time in most of the hotels will be 2 PM and check-out time in most of the hotels will be 11 AM.",
    "Early Check in and Late Check out is not the part of the package hence if required, against same need to be paid over and above the given cost.",
    "Rooms, Sightseeing and Flight Tickets are Subject to availability at the time of booking.",
    "We will not be responsible for loss of any valuables you will be carrying along with you during the tour.",
    "We strongly recommend to take travel insurance for your tour duration to avoid any hassles caused due to unforeseen circumstances.",
    "Any increase in Gov. Taxes, Airfare, Fuel Surcharge & Airlines taxes charged by the airlines on the air ticket before the issuance of flight tickets, the same shall be charged extra irrespective of the booking date.",
    "Peak season, weekend and special event surcharges if any, will be applicable over and above the given costing.",
    "All personal expenses, optional tours and extra meals has to be paid directly.",
    "Portages at Hotels, Airport & Sea Ports is not the part of given holiday package.",
    "Due to any unforeseen circumstances or natural calamities which cause any changes or cancellation in your itinerary, Sightseeing's / activities, transfers --- no refund or compensation will be provided against the same.",
    "There will be no refund for the unused and unutilized services.",
    "RT-PCR (if required) need to be taken within 48 hours from Departure Date.",
    "Anything not mentioned in the inclusions has to be paid directly or in advance (if added or availed).",
    "Required OTB for ECR Passport depending on Destination you flying to.",
    "Note: Double-Dose Vaccination Certificate is mandatory to carry for international travel.",
    "Rates are based on today's ROE (Rate of Exchange) and final ROE will be calculated at the time of making the final/total Payment against your Tour Package.",
]


# ----------------------------------------------------------------------
# Visa FAQ — country-keyed (scope: single-country bookings only).
# Renders only when booking.visa_included == "true" AND the booking's
# country has an entry below. Currently only Vietnam content exists;
# other countries will simply render nothing until their FAQ is added
# here, by design (no fabricated content for missing countries).
# ----------------------------------------------------------------------

VISA_FAQ = {
    "Vietnam": {
        "intro": (
            "This package comes with a Visa included. You will have to "
            "provide the documents required to process the VISA. Our agent "
            "will get in touch with you post booking to initiate the Visa "
            "process."
        ),
        "faqs": [
            {
                "question": "Do I need to share my original passport to get a Vietnam visa?",
                "answer": "No, original passport is not required for processing. Upload only soft copies of the documents.",
            },
            {
                "question": "How long does it take to get a visa?",
                "answer": "Usually a visa is approved by the embassy in 3-5 working days.",
            },
            {
                "question": "When can we enter Vietnam and how many days can we stay in Vietnam once we enter?",
                "answer": "You can enter Vietnam within 90 days validity period and can stay for a max of 30 days in Vietnam from your date of entry.",
            },
            {
                "question": "Can I enter Vietnam by sea or land?",
                "answer": "Yes with e-visa you can enter Vietnam through specific borders and ports from Thailand, Laos and Cambodia.",
            },
            {
                "question": "Can I get a Visa on arrival for Vietnam?",
                "answer": "Yes, you can get your visa on arrival. However we recommend you to take a visa from India to avoid standing in long queues and paperwork.",
            },
            {
                "question": "What documents are required at Immigration?",
                "answer": "Below are the list of documents required at immigration: Original passport. Print out of your e-visa. Onward and return air tickets. Accommodation proof (hotel vouchers or residential proof).",
            },
            {
                "question": "Does every Indian National travelling to Vietnam need a Visa?",
                "answer": "Visa is required for all Indian Nationals",
            },
        ],
    },
}


def get_visa_faq(country: str):
    """
    Returns the {intro, faqs} dict for a country, or None if no FAQ
    content exists for it yet. Caller is responsible for only calling
    this when booking.visa_included == "true".
    """
    return VISA_FAQ.get(country)
