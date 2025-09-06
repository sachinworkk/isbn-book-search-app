import pytest
from unittest.mock import patch, MagicMock

import requests
from services.strategies.google_book_fetcher import GoogleBookFetcher


@pytest.mark.django_db
class TestGoogleBooksFetcher:

    @patch("services.strategies.google_book_fetcher.requests.get")
    def test_fetch_success_with_similar_books(self, mock_get):
        """Test normal flow where main and similar books are returned."""
        main_response = {
            "items": [
                {
                    "id": "book123",
                    "volumeInfo": {
                        "title": "Test Book",
                        "authors": ["John Doe"],
                        "categories": ["Fiction"],
                        "publisher": "Test Publisher",
                        "imageLinks": {"thumbnail": "http://example.com/img.jpg"},
                        "publishedDate": "2020",
                        "industryIdentifiers": [
                            {"type": "ISBN_13", "identifier": "123"}
                        ],
                    },
                }
            ]
        }
        similar_response = {
            "items": [
                {
                    "id": "book456",
                    "volumeInfo": {
                        "title": "Similar Book",
                        "authors": ["Jane Doe"],
                        "publisher": "Other Publisher",
                        "imageLinks": {"thumbnail": "http://example.com/img2.jpg"},
                        "publishedDate": "2019",
                    },
                }
            ]
        }

        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: main_response),
            MagicMock(status_code=200, json=lambda: similar_response),
        ]

        fetcher = GoogleBookFetcher()
        result = fetcher.fetch("123")

        assert "items" in result
        assert len(result["items"]) == 2
        assert result["items"][0]["title"] == "Test Book"
        assert result["items"][1]["title"] == "Similar Book"

    @patch("services.strategies.google_book_fetcher.requests.get")
    def test_fetch_no_items(self, mock_get):
        """Test when main API returns no items."""
        main_response = {"items": []}
        mock_get.return_value = MagicMock(status_code=200, json=lambda: main_response)

        fetcher = GoogleBookFetcher()
        result = fetcher.fetch("999")

        assert result is None

    @patch("services.strategies.google_book_fetcher.requests.get")
    def test_fetch_main_api_failure(self, mock_get):
        """Test when main API request fails."""
        mock_get.side_effect = requests.RequestException("Network error")

        fetcher = GoogleBookFetcher()
        result = fetcher.fetch("123")

        assert result == {}

    @patch("services.strategies.google_book_fetcher.requests.get")
    def test_fetch_similar_books_failure(self, mock_get):
        """Test when similar books API fails but main book is returned."""
        main_response = {
            "items": [
                {
                    "id": "book123",
                    "volumeInfo": {
                        "title": "Test Book",
                        "authors": ["John Doe"],
                        "categories": ["Fiction"],
                        "publisher": "Test Publisher",
                        "imageLinks": {"thumbnail": "http://example.com/img.jpg"},
                        "publishedDate": "2020",
                        "industryIdentifiers": [
                            {"type": "ISBN_13", "identifier": "123"}
                        ],
                    },
                }
            ]
        }

        # Similar books API will raise an exception
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: main_response),
            requests.RequestException("Failed similar API"),
        ]

        fetcher = GoogleBookFetcher()
        result = fetcher.fetch("123")

        # Only main book should be returned
        assert "items" in result
        assert len(result["items"]) == 1
        assert result["items"][0]["title"] == "Test Book"
