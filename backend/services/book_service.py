from .strategies.BookFetcherStrategy import BookFetcherStrategy


class BookService:
    def __init__(self, strategies: list[BookFetcherStrategy]):
        self.strategies = strategies

    def get_book(self, isbn: str) -> dict:
        for strategy in self.strategies:
            book_data = strategy.fetch(isbn)
            return book_data
        return {}
