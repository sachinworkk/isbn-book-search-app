from abc import ABC, abstractmethod


class BookFetcherStrategy(ABC):
    @abstractmethod
    def fetch(self, isbn: str) -> dict:
        pass
