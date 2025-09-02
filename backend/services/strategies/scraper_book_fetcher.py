import logging
from playwright.sync_api import sync_playwright
from config.constants import SCRAPPING_ELEMENTS
from django.conf import settings
from services.strategies.book_fetcher import BookFetcherStrategy

logger = logging.getLogger(__name__)  # module-based logger

# Global persistent Playwright instance and browser
_playwright = None
_browser = None


def get_browser():
    global _playwright, _browser
    if _playwright is None:
        logger.info("Starting Playwright...")
        _playwright = sync_playwright().start()
    if _browser is None:
        logger.info("Launching Chromium browser (headless)...")
        _browser = _playwright.chromium.launch(
            headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
    return _browser


class ScraperBookFetcher(BookFetcherStrategy):
    def fetch(self, isbn: str):
        logger.info("Scraping book info for ISBN: %s", isbn)

        browser = get_browser()
        page = browser.new_page()

        try:
            url = settings.BOOK_SCRAPER_URL + isbn
            logger.debug("Navigating to scraper URL: %s", url)
            page.goto(url)

            # Check for 404 page
            try:
                content_head = page.locator(SCRAPPING_ELEMENTS["notFound"]).inner_text()
                if content_head == "404 - Page Not Found":
                    logger.warning("Book not found (404) for ISBN: %s", isbn)
                    page.close()
                    return {"items": []}
            except Exception:
                logger.debug("No explicit 404 message found for ISBN: %s", isbn)

            # Extract book details
            try:
                title = (
                    page.inner_text(SCRAPPING_ELEMENTS.get("title", "")) or "Not found"
                )
                author = (
                    page.inner_text(SCRAPPING_ELEMENTS.get("author", "")) or "Unknown"
                )
                logger.debug(
                    "Parsed title='%s', author='%s' for ISBN %s", title, author, isbn
                )

                cover_src = ""
                try:
                    page.wait_for_selector(SCRAPPING_ELEMENTS["img"])
                    cover_src = (
                        page.get_attribute(SCRAPPING_ELEMENTS["img"], "src") or ""
                    )
                    if cover_src.startswith("//"):
                        cover_src = "https:" + cover_src
                    logger.debug("Found cover image for ISBN %s: %s", isbn, cover_src)
                except Exception as e:
                    logger.warning("Cover image not found for ISBN %s: %s", isbn, e)

            except Exception as e:
                logger.error("Error scraping content for ISBN %s: %s", isbn, e)
                page.close()
                return {"items": []}

        finally:
            page.close()

        logger.info("Successfully scraped book for ISBN: %s", isbn)

        return {
            "items": [
                {
                    "id": isbn,
                    "industryIdentifiers": [{"identifier": isbn}],
                    "title": title,
                    "authors": [author],
                    "imageLinks": {"smallThumbnail": cover_src},
                }
            ]
        }
