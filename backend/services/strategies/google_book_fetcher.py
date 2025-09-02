import logging
import requests
from django.conf import settings
from services.strategies.book_fetcher import BookFetcherStrategy

logger = logging.getLogger(__name__)  # module-based logger


class GoogleBookFetcher(BookFetcherStrategy):
    def fetch(self, isbn: str) -> dict:
        url = f"{settings.BOOK_API_URL}?q=isbn:{isbn}"
        logger.info("Fetching book for ISBN: %s", isbn)

        try:
            response_data = requests.get(url, timeout=10)
            response_data.raise_for_status()
            data = response_data.json()
            logger.debug("Google Books API response: %s", data)
        except requests.RequestException as e:
            logger.error("Failed to fetch Google Books API for ISBN %s: %s", isbn, e)
            return {}

        if "items" not in data or not data["items"]:
            logger.warning("No book items found for ISBN: %s", isbn)
            return None

        try:
            id = data["items"][0]["id"]
            volume_info = data["items"][0]["volumeInfo"]
            author = volume_info.get("authors", "")[0]
            category = volume_info.get("categories", "")[0]
            similar_url = (
                f"{settings.BOOK_API_URL}?q=inauthor:{author}+subject:{category}"
            )

            try:
                similar_res = requests.get(similar_url)
                similar_res.raise_for_status()
                similar_data = similar_res.json()
                logger.debug("Similar books API response: %s", similar_data)
            except (requests.RequestException, KeyError, IndexError, TypeError) as e:
                logger.warning("Failed to fetch similar books for ISBN %s: %s", isbn, e)
                return {
                    "id": id,
                    "title": volume_info.get("title", ""),
                    "authors": volume_info.get("authors", []),
                    "publisher": volume_info.get("publisher", ""),
                    "imageLinks": volume_info.get("imageLinks", ""),
                    "publishedDate": volume_info.get("publishedDate", ""),
                    "industryIdentifiers": volume_info.get("industryIdentifiers", ""),
                }

        except (KeyError, IndexError, TypeError) as e:
            logger.error("Error parsing book data for ISBN %s: %s", isbn, e)
            return {}

        similar_book_data = [
            {
                "id": item.get("id", ""),
                "title": item["volumeInfo"].get("title", ""),
                "authors": item["volumeInfo"].get("authors", []),
                "publisher": item["volumeInfo"].get("publisher", ""),
                "imageLinks": item["volumeInfo"].get("imageLinks", ""),
                "publishedDate": item["volumeInfo"].get("publishedDate", ""),
                "industryIdentifiers": volume_info.get("industryIdentifiers", ""),
            }
            for item in similar_data.get("items", [])
        ]

        logger.info(
            "Fetched %d similar books for ISBN %s", len(similar_book_data), isbn
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
