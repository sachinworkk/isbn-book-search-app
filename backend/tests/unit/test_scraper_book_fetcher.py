import pytest
from unittest.mock import patch, MagicMock
from services.strategies.scraper_book_fetcher import ScraperBookFetcher
from config.constants import SCRAPPING_ELEMENTS


@pytest.mark.django_db
class TestScraperBookFetcher:
    @patch("services.strategies.scraper_book_fetcher.get_browser")
    def test_fetch_success(self, mock_get_browser):
        """
        Test successful scraping with title, author, and cover image.
        """
        mock_page = MagicMock()
        mock_browser = MagicMock()
        mock_playwright = MagicMock()

        # Make get_browser return (browser, playwright)
        mock_get_browser.return_value = (mock_browser, mock_playwright)

        # new_page returns mock page
        mock_browser.new_page.return_value = mock_page

        # Mock title & author selectors
        def mock_inner_text(selector):
            if selector == SCRAPPING_ELEMENTS["title"]:
                return "Test Title"
            if selector == SCRAPPING_ELEMENTS["author"]:
                return "Test Author"
            return ""

        mock_page.inner_text.side_effect = mock_inner_text
        mock_page.get_attribute.return_value = "//images.example.com/cover.jpg"

        fetcher = ScraperBookFetcher()
        result = fetcher.fetch("111")

        # Assertions on scraped data
        assert "items" in result
        assert result["items"][0]["title"] == "Test Title"
        assert result["items"][0]["authors"] == ["Test Author"]
        assert result["items"][0]["imageLinks"]["smallThumbnail"].startswith("https:")

        # Assertions on browser/page lifecycle
        mock_browser.new_page.assert_called_once()
        mock_page.goto.assert_called_once()
        mock_page.close.assert_called_once()
        mock_browser.close.assert_called_once()
        mock_playwright.stop.assert_called_once()

    @patch("services.strategies.scraper_book_fetcher.get_browser")
    def test_fetch_404_page(self, mock_get_browser):
        """
        Test when scraping returns 404.
        Should return empty items.
        """
        mock_page = MagicMock()
        mock_browser = MagicMock()
        mock_playwright = MagicMock()

        mock_get_browser.return_value = (mock_browser, mock_playwright)
        mock_browser.new_page.return_value = mock_page

        # Simulate 404 page
        mock_page.locator().inner_text.return_value = "404 - Page Not Found"

        fetcher = ScraperBookFetcher()
        result = fetcher.fetch("404isbn")

        assert result == {"items": []}

        # Ensure page/browser/playwright are closed
        mock_page.close.assert_called_once()
        mock_browser.close.assert_called_once()
        mock_playwright.stop.assert_called_once()

    @patch("services.strategies.scraper_book_fetcher.get_browser")
    def test_fetch_scraping_error(self, mock_get_browser):
        """
        Test unexpected error while scraping.
        Should gracefully return empty items.
        """
        mock_page = MagicMock()
        mock_browser = MagicMock()
        mock_playwright = MagicMock()

        mock_get_browser.return_value = (mock_browser, mock_playwright)
        mock_browser.new_page.return_value = mock_page

        # Simulate scraping failure
        mock_page.inner_text.side_effect = Exception("Scraping failed")

        fetcher = ScraperBookFetcher()
        result = fetcher.fetch("failisbn")

        assert result == {"items": []}

        # Ensure page/browser/playwright are closed
        mock_page.close.assert_called_once()
        mock_browser.close.assert_called_once()
        mock_playwright.stop.assert_called_once()

    @patch("services.strategies.scraper_book_fetcher.get_browser")
    def test_fetch_no_cover_image(self, mock_get_browser):
        """
        Test when no cover image available.
        Should still return book data with empty image link.
        """
        mock_page = MagicMock()
        mock_browser = MagicMock()
        mock_playwright = MagicMock()

        mock_get_browser.return_value = (mock_browser, mock_playwright)
        mock_browser.new_page.return_value = mock_page

        # Return valid title & author
        def mock_inner_text(selector):
            if selector == SCRAPPING_ELEMENTS["title"]:
                return "Book Without Image"
            if selector == SCRAPPING_ELEMENTS["author"]:
                return "Jane Doe"
            return ""

        mock_page.inner_text.side_effect = mock_inner_text
        # Simulate missing image (raises exception)
        mock_page.get_attribute.side_effect = Exception("No image found")

        fetcher = ScraperBookFetcher()
        result = fetcher.fetch("noimg")

        # Image link should be empty
        assert result["items"][0]["imageLinks"]["smallThumbnail"] == ""

        # Ensure page/browser/playwright are closed
        mock_page.close.assert_called_once()
        mock_browser.close.assert_called_once()
        mock_playwright.stop.assert_called_once()
