import requests

from django.conf import settings
from services.strategies.BookFetcherStrategy import BookFetcherStrategy


class GoogleBooksFetcher(BookFetcherStrategy):
    def fetch(self, isbn: str) -> dict:
        url = f"{settings.BOOK_API_URL}?q=isbn:{isbn}"

        response_data = requests.get(url)

        data = response_data.json()

        if "items" not in data or not data["items"]:
            return None

        try:
            id = data["items"][0]["id"]
            volume_info = data["items"][0]["volumeInfo"]
            author = volume_info.get("authors", "")[0]
            category = volume_info.get("categories", "")[0]
            similarUrl = (
                f"{settings.BOOK_API_URL}?q=inauthor:{author}subject:{category}"
            )

            try:
                similarRes = requests.get(similarUrl)
                similarData = similarRes.json()
            except (KeyError, IndexError, TypeError):
                return {
                    "id": id,
                    "title": volume_info.get("title", ""),
                    "authors": volume_info.get("authors", []),
                    "publisher": volume_info.get("publisher", ""),
                    "imageLinks": volume_info.get("imageLinks", ""),
                    "publishedDate": volume_info.get("publishedDate", ""),
                    "industryIdentifiers": volume_info.get("industryIdentifiers", ""),
                }

        except (KeyError, IndexError, TypeError):
            return {}

        similar_book_data = list(
            map(
                lambda data: {
                    "id": data.get("id", ""),
                    "title": data["volumeInfo"].get("title", ""),
                    "authors": data["volumeInfo"].get("authors", []),
                    "publisher": data["volumeInfo"].get("publisher", ""),
                    "imageLinks": data["volumeInfo"].get("imageLinks", ""),
                    "publishedDate": data["volumeInfo"].get("publishedDate", ""),
                    "industryIdentifiers": volume_info.get("industryIdentifiers", ""),
                },
                similarData["items"],
            )
        )

        return {
            "items": [
                {
                    "id": id,
                    "title": volume_info.get("title", ""),
                    "authors": volume_info.get("authors", []),
                    "publisher": volume_info.get("publisher", ""),
                    "imageLinks": volume_info.get("imageLinks", ""),
                    "publishedDate": volume_info.get("publishedDate", ""),
                    "industryIdentifiers": volume_info.get("industryIdentifiers", ""),
                },
                *similar_book_data,
            ]
        }
