"""
Phase E1 (pulled forward to close Phase A1 / defects D4 + D5)
=============================================================

Destination image resolution for the itinerary cover page (and, later, for
per-stop images in Phase C4).

WHY THIS EMITS data: URIs AND NOT PATHS  (defect D4 — read before changing)
--------------------------------------------------------------------------
The PDF renderer loads HTML via Playwright's `page.set_content()`, which leaves
the document URL as `about:blank`. Three approaches were measured against
Chromium; only the third loads the image:

  1. Relative path + `browser.new_context(base_url=...)`  -> FAILS.
     `base_url` only affects `page.goto()` and APIRequestContext. It is never
     consulted by `set_content()`, so the path resolves against nothing.
     (`set_content()` has no `base_url` parameter at all — the Phase A1 spec
     was wrong on this point.)

  2. Absolute `file:///...` URI (or a `<base href="file://...">` tag) -> ALSO
     FAILS, and this is the non-obvious part. An `about:blank` document is an
     opaque origin, and Chromium refuses to load `file://` subresources into
     it. Playwright reports the image as `requestfailed` and `naturalWidth`
     stays 0 — the PDF renders a broken image and no exception is raised.

  3. `data:image/jpeg;base64,...` -> WORKS. The bytes travel inside the HTML,
     so there is no subresource fetch and no origin check.

So the file is read at render time and inlined. Do NOT "clean this up" back to
a path, a `<base>` tag, or a `base_url=` context option — all three regress to
a silently broken image.

(The one alternative that would also work is writing the HTML to a temp file
and using `page.goto()` on it, which gives the document a real `file://`
origin. That was rejected: it adds temp-file lifecycle and concurrency
handling to a code path that currently has neither.)

FILE NAMING CONVENTION
----------------------
    static/destinations/{Country}_{Location}.jpg   (most specific)
    static/destinations/{Country}.jpg              (fallback)
    -> None                                        (template renders the
                                                    gradient cover variant)

Spaces in country/location names become underscores, so
"Ho Chi Minh City" -> `Vietnam_Ho_Chi_Minh_City.jpg`. Matching is
case-insensitive so an editor dropping in `vietnam.jpg` still works.
"""

import base64
import logging
from functools import lru_cache
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

# static/destinations/ lives next to this module, i.e. at the project root.
STATIC_ROOT = Path(__file__).parent / "static"
DESTINATIONS_DIR = STATIC_ROOT / "destinations"

# .jpg is the documented convention; the others are accepted so that a
# correctly-named file is never silently ignored because of its extension.
MIME_BY_EXTENSION = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
}

# Inlined bytes inflate the HTML by ~4/3. A 4 MB source image becomes ~5.5 MB
# of base64 in the document, which Chromium handles but slows every render.
# Oversized files are skipped (gradient fallback) with a loud log line rather
# than quietly degrading PDF generation for everyone.
MAX_IMAGE_BYTES = 4 * 1024 * 1024


def _slug(value: str) -> str:
    """'Ho Chi Minh City' -> 'Ho_Chi_Minh_City'. Empty input -> ''."""
    if not value:
        return ""
    return "_".join(str(value).split())


def _find(stem: str) -> Optional[Path]:
    """
    Return the first file in DESTINATIONS_DIR whose stem matches `stem`
    case-insensitively and whose extension is supported. None if no match.
    """
    if not stem or not DESTINATIONS_DIR.is_dir():
        return None

    target = stem.casefold()
    for candidate in sorted(DESTINATIONS_DIR.iterdir()):
        if not candidate.is_file():
            continue
        if candidate.suffix.lower() not in MIME_BY_EXTENSION:
            continue
        if candidate.stem.casefold() == target:
            return candidate
    return None


def resolve_image_file(country: str, location: Optional[str] = None) -> Optional[Path]:
    """
    Locate the destination image on disk and return its Path.

    Lookup order:
        1. {Country}_{Location}   (only attempted when `location` is given)
        2. {Country}
        3. None

    Use this when you need the real filesystem path — e.g. to build an http
    URL for the `/static` mount that the React frontend consumes. For anything
    that ends up inside the PDF, use resolve_image_path().
    """
    if not country:
        return None

    country_slug = _slug(country)

    if location:
        match = _find(f"{country_slug}_{_slug(location)}")
        if match:
            return match

    return _find(country_slug)


@lru_cache(maxsize=64)
def _encode(path_str: str, mtime: float, size: int) -> Optional[str]:
    """
    Read and base64-encode one image. Cached on (path, mtime, size) so a batch
    render of N bookings for the same country encodes the file once, while
    replacing the file on disk still invalidates the entry.
    """
    path = Path(path_str)
    if size > MAX_IMAGE_BYTES:
        logger.warning(
            "Destination image %s is %.1f MB (limit %.1f MB) - skipping; "
            "the gradient cover will be used. Downscale the file to enable it.",
            path.name, size / 1_048_576, MAX_IMAGE_BYTES / 1_048_576,
        )
        return None

    mime = MIME_BY_EXTENSION[path.suffix.lower()]
    try:
        encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    except OSError as exc:
        logger.warning("Could not read destination image %s: %s", path, exc)
        return None

    return f"data:{mime};base64,{encoded}"


def resolve_image_path(country: str, location: Optional[str] = None) -> Optional[str]:
    """
    Resolve a destination image to a `data:` URI ready to drop into an
    `<img src>` — see the module docstring for why it is not a path.

    Returning None is a normal, expected outcome — the template's
    `{% if cover_image_path %}` guard falls back to the gradient cover.
    """
    match = resolve_image_file(country, location)
    if not match:
        return None

    stat = match.stat()
    return _encode(str(match), stat.st_mtime, stat.st_size)


def resolve_cover_image(booking: dict) -> Optional[str]:
    """
    Cover-page convenience wrapper.

    Honours an explicit `cover_image_path` on the booking dict if one is
    present (lets a caller or a future admin override win), otherwise resolves
    from the first country in `places_to_cover`.
    """
    explicit = booking.get("cover_image_path")
    if explicit:
        return explicit

    places = booking.get("places_to_cover") or {}
    if not places:
        return None

    return resolve_image_path(next(iter(places)))