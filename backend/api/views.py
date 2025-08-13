from rest_framework.decorators import api_view
from rest_framework.response import Response

from services.book_service import BookService
from services.strategies.GoogleBookFetcher import GoogleBooksFetcher
from services.strategies.ScraperBookFetcher import ScraperBookFetcher


@api_view(["GET"])
def getData(request):
    isbn = request.query_params.get("isbn", None)
    if not isbn:
        return Response(
            {"error": "ISBN query parameter is required"},
            status=400,
        )

    strategies = [
        GoogleBooksFetcher(),
        ScraperBookFetcher(),
    ]

    service = BookService(strategies)

    book_data = service.get_book(isbn)
    if not book_data:
        return Response({"items": []}, status=404)

    return Response(book_data)
