from playwright.sync_api import sync_playwright

from services.strategies.BookFetcherStrategy import BookFetcherStrategy


class ScraperBookFetcher(BookFetcherStrategy):

    def fetch(self, isbn: str):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            url = f"https://openlibrary.org/isbn/{isbn}"
            page.goto(url)

            try:
                title = page.inner_text("h1.work-title")
            except:
                title = "Not found"

            try:
                author = page.inner_text("a[itemprop='author']")
            except:
                author = "Unknown"

            try:
                description = page.inner_text("div#description")  # may not always exist
            except:
                description = "No description available"

            try:
                # wait for cover image to appear
                page.wait_for_selector("img.cover")

                # get the image src
                cover_src = page.get_attribute("img.cover", "src")

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
