from rest_framework.decorators import api_view
from rest_framework.response import Response

from services.strategies.google_book_fetcher import GoogleBookFetcher
from services.strategies.scraper_book_fetcher import ScraperBookFetcher


@api_view(["GET"])
def getData(request):
    isbn = request.query_params.get("isbn", "").strip()
    if not isbn:
        return Response({"items": []}, status=200)  # safe default

    service = GoogleBookFetcher()

    book_data = service.fetch(isbn)
    if not book_data:
        return Response({"items": []}, status=404)

    return Response(book_data)


@api_view(["GET"])
def getScrappedData(request):
    isbn = request.query_params.get("isbn", "").strip()
    if not isbn:
        return Response({"items": []}, status=200)  # safe default

    service = ScraperBookFetcher()

    book_data = service.fetch(isbn)
    if not book_data:
        return Response({"items": [], "error": "Failed to scrape"}, status=500)

    return Response(book_data)
