import logging
from playwright.sync_api import sync_playwright
from config.constants import SCRAPPING_ELEMENTS
from django.conf import settings
from services.strategies.BookFetcherStrategy import BookFetcherStrategy

logger = logging.getLogger(__name__)

# Global persistent Playwright instance and browser
_playwright = None
_browser = None


def get_browser():
    global _playwright, _browser
    if _playwright is None:
        _playwright = sync_playwright().start()
    if _browser is None:
        _browser = _playwright.chromium.launch(
            headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
    return _browser


class ScraperBookFetcher(BookFetcherStrategy):

    def fetch(self, isbn: str):
        browser = get_browser()
        page = browser.new_page()

        try:
            url = settings.BOOK_SCRAPER_URL + isbn
            page.goto(url)

            try:
                content_head = page.locator(SCRAPPING_ELEMENTS["notFound"]).inner_text()
                if content_head == "404 - Page Not Found":
                    page.close()
                    return {"items": []}
            except:
                pass

            try:
                title = (
                    page.inner_text(SCRAPPING_ELEMENTS.get("title", "")) or "Not found"
                )
                author = (
                    page.inner_text(SCRAPPING_ELEMENTS.get("author", "")) or "Unknown"
                )

                cover_src = ""
                try:
                    page.wait_for_selector(SCRAPPING_ELEMENTS["img"])
                    cover_src = (
                        page.get_attribute(SCRAPPING_ELEMENTS["img"], "src") or ""
                    )
                    if cover_src.startswith("//"):
                        cover_src = "https:" + cover_src
                except Exception as e:
                    logger.warning(f"Cover image not found for ISBN {isbn}: {e}")

            except Exception as e:
                logger.error(f"Error scraping ISBN {isbn}: {e}")
                page.close()
                return {"items": []}

        finally:
            page.close()

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
