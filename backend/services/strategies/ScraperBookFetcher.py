from playwright.sync_api import sync_playwright
from config.constants import SCRAPPING_ELEMENTS

from django.conf import settings
from services.strategies.BookFetcherStrategy import BookFetcherStrategy


class ScraperBookFetcher(BookFetcherStrategy):

    def fetch(self, isbn: str):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            url = settings.BOOK_SCRAPER_URL + isbn
            page.goto(url)

            try:
                contentHead = page.locator(SCRAPPING_ELEMENTS["notFound"]).inner_text()
                if contentHead == "404 - Page Not Found":
                    return {"items": []}
            except:
                try:
                    title = page.inner_text(SCRAPPING_ELEMENTS["title"])
                except:
                    title = "Not found"

                try:
                    author = page.inner_text(SCRAPPING_ELEMENTS["author"])
                except:
                    author = "Unknown"

                try:
                    description = page.inner_text(
                        "div#description"
                    )  # may not always exist
                except:
                    description = "No description available"

                try:
                    # wait for cover image to appear
                    page.wait_for_selector(SCRAPPING_ELEMENTS["img"])

                    # get the image src
                    cover_src = page.get_attribute(SCRAPPING_ELEMENTS["img"], "src")

                    # OpenLibrary sometimes uses protocol-relative URLs ("//...")
                    if cover_src and cover_src.startswith("//"):
                        cover_src = "https:" + cover_src
                        print(cover_src)

                except:
                    cover_src = ""

            browser.close()

            return {
                "items": [
                    {
                        "id": isbn,
                        "industryIdentifiers": [{"identifier": isbn}],
                        "title": title,
                        "authors": [author],
                        "description": description,
                        "imageLinks": {"smallThumbnail": cover_src},
                    }
                ]
            }
