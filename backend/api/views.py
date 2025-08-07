import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def getData(request):
    isbn = request.query_params.get("isbn", None)
    if not isbn:
        return Response(
            {"error": "ISBN query parameter is required"},
            status=400,
        )

    url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}"
    r = requests.get(url)
    data = r.json()

    if "items" not in data:
        return Response({"error": "Book not found"}, status=400)

    try:
        volume_info = data["items"][0]["volumeInfo"]
    except (KeyError, IndexError, TypeError):
        return Response({})

    book_data = {
        "title": volume_info.get("title", ""),
        "authors": volume_info.get("authors", []),
        "publisher": volume_info.get("publisher", ""),
        "imageLinks": volume_info.get("imageLinks", ""),
        "publishedDate": volume_info.get("publishedDate", ""),
    }

    return Response(book_data)
