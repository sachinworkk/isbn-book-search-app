import requests

from services.strategies.BookFetcherStrategy import BookFetcherStrategy


class GoogleBooksFetcher(BookFetcherStrategy):
    def fetch(self, isbn: str) -> dict:
        url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}"

        response_data = requests.get(url)

        data = response_data.json()

        if "items" not in data or not data["items"]:
            return {}

        try:
            volume_info = data["items"][0]["volumeInfo"]
        except (KeyError, IndexError, TypeError):
            return {}

        book_data = {
            "title": volume_info.get("title", ""),
            "authors": volume_info.get("authors", []),
            "publisher": volume_info.get("publisher", ""),
            "imageLinks": volume_info.get("imageLinks", ""),
            "publishedDate": volume_info.get("publishedDate", ""),
        }

        return book_data
