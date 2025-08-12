from services.strategies.BookFetcherStrategy import BookFetcherStrategy


class ScraperBookFetcher(BookFetcherStrategy):
    def fetch(self, isbn: str) -> dict:
        return {
            "title": "Scraped Book Example",
            "authors": ["John Doe"],
            "publisher": "Custom Scraper Source",
            "imageLinks": {},
            "publishedDate": "2023",
        }
