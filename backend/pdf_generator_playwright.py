import asyncio
import logging
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from playwright.async_api import async_playwright, Browser, BrowserContext
import static_content
from image_resolver import resolve_cover_image
from typing import Optional

# NOTE (defect D3): no event loop policy is set in this module, deliberately.
#
# The policy is set once, at process start, in main.py:
#     asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
#
# ProactorEventLoop is the CORRECT policy here. Playwright launches Chromium as
# a subprocess, and on Windows SelectorEventLoop raises NotImplementedError from
# subprocess_exec() — Proactor implements it. Earlier project notes described
# the Selector policy as "the Windows fix"; that is backwards and would break
# PDF generation on Windows if reintroduced.
#
# `import asyncio` above stays — asyncio.run() is used by the sync wrapper.

logger = logging.getLogger(__name__)

# Path configuration
TEMPLATE_DIR = Path(__file__).parent
TEMPLATE_FILE = "itinerary_template.html"

# Page setup for PDF (A4 standard)
PDF_MARGIN = {"top": "10mm", "bottom": "10mm", "left": "10mm", "right": "10mm"}

# NOTE (defect D4): there is deliberately no BASE_URL here.
# Rendering goes through page.set_content(), which leaves the document URL as
# about:blank. Relative asset paths therefore cannot resolve, and
# new_context(base_url=...) does not help — it only affects page.goto() and
# API requests. Absolute file:// URIs do not help either: an about:blank
# document is an opaque origin and Chromium blocks file:// subresources into
# it (image fails silently, naturalWidth stays 0).
# Images are consequently inlined as data: URIs by image_resolver.
# Do not reintroduce base_url or a <base> tag here — see image_resolver.py.


def render_template_to_html(booking: dict) -> str:
    """
    Render Jinja2 template with booking data to HTML string.
    (Same logic as generate_pdf_poc.py, reused here)
    """
    from generate_pdf_poc import (
        compute_stop_dates,
        build_stops_with_sightseeings,
        build_itinerary_timeline,
        get_booking_visa_faq,
    )

    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    template = env.get_template(TEMPLATE_FILE)

    context = {
        "booking": booking,
        # Phase A1/E1: resolved to an absolute file:// URI, or None when no
        # destination image exists (template then renders the gradient cover).
        "cover_image_path": resolve_cover_image(booking),
        "countries": list(booking["places_to_cover"].keys()),
        "itinerary_timeline": build_itinerary_timeline(booking),
        "tcs_explanation_paragraphs": static_content.TCS_EXPLANATION_PARAGRAPHS,
        "tcs_credit_block_points": static_content.TCS_CREDIT_BLOCK_POINTS,
        "terms_and_conditions": static_content.TERMS_AND_CONDITIONS,
        "visa_faq": get_booking_visa_faq(booking),
    }

    return template.render(**context)


async def render_itinerary_pdf_async(
    booking: dict,
    output_path: str,
    browser: Optional[Browser] = None,
    close_browser: bool = True,
) -> str:
    """
    Async PDF generator using Playwright.

    Args:
        booking: Dictionary with booking data (from database or API)
        output_path: File path where PDF will be saved
        browser: Optional reused Browser instance (for batch rendering)
        close_browser: If True, close browser after render (ignored if browser passed)

    Returns:
        Path to saved PDF file

    Raises:
        Exception: On Playwright or rendering errors
    """
    html_string = render_template_to_html(booking)

    if browser is None:
        # Launch new browser instance (slower, for single-shot rendering)
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={"width": 1024, "height": 1440},
            )
            page = await context.new_page()

            try:
                # Destination images arrive inlined as data: URIs (see D4
                # note above), so nothing is fetched over the network here.
                await page.set_content(
                    html_string,
                    wait_until="networkidle"
                )
                await page.pdf(
                    path=output_path,
                    format="A4",
                    margin=PDF_MARGIN,
                    print_background=True,
                )
                logger.info(f"PDF rendered: {output_path}")
                return output_path
            except Exception as e:
                logger.error(f"PDF render failed: {e}")
                raise
            finally:
                await context.close()
                await browser.close()
    else:
        # Use existing browser (faster, for batch rendering)
        context = await browser.new_context(
            viewport={"width": 1024, "height": 1440},
        )
        page = await context.new_page()

        try:
            # Same as the single-shot branch above.
            await page.set_content(
                html_string,
                wait_until="networkidle"
            )
            await page.pdf(
                path=output_path,
                format="A4",
                margin=PDF_MARGIN,
                print_background=True,
            )
            logger.info(f"PDF rendered (reused browser): {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"PDF render failed: {e}")
            raise
        finally:
            await context.close()
            if close_browser:
                await browser.close()


def render_itinerary_pdf(booking: dict, output_path: str) -> str:
    """
    Synchronous wrapper for async PDF generator.
    Use this if calling from non-async context (e.g., background task, cron job).
    """
    return asyncio.run(render_itinerary_pdf_async(booking, output_path))


# ============================================================================
# BATCH RENDERING (if generating multiple PDFs in one session)
# ============================================================================

async def render_multiple_pdfs_batch(
    bookings: list, output_dir: str
) -> list:
    """
    Render multiple PDFs efficiently by reusing one browser instance.
    Much faster than rendering each separately (reuses Chromium across calls).

    Args:
        bookings: List of booking dicts
        output_dir: Directory to save all PDFs

    Returns:
        List of output file paths
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    output_paths = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        try:
            for i, booking in enumerate(bookings):
                output_path = Path(output_dir) / f"itinerary_{booking['id']}.pdf"
                await render_itinerary_pdf_async(
                    booking,
                    str(output_path),
                    browser=browser,
                    close_browser=False,  # Keep browser open for next iteration
                )
                output_paths.append(str(output_path))
                logger.info(f"[{i+1}/{len(bookings)}] {output_path}")
        finally:
            await browser.close()

    return output_paths