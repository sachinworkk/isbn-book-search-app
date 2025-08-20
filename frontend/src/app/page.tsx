"use client";
import { useState } from "react";
import BookSearch from "./components/BookSearch";

interface Book {
  id: string;
  authors: [];
  imageLinks: { smallThumbnail: string; thumbnail: string };
  industryIdentifiers: { type: string; identifier: string }[];
  publishedDate: string;
  publisher: string;
  title: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleBookSearchAsync = async (book: string) => {
    setIsLoading(true);
    setIsSearching(true);

    try {
      const res = await fetch(`http://localhost:8000/books/?isbn=${book}`);
      const data = await res.json();

      setBooks(data?.items);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <form className="p-5 w-1/2 mt-8 flex flex-col gap-4">
        <BookSearch
          books={books}
          isLoading={isLoading}
          isSearching={isSearching}
          onBookSearch={handleBookSearchAsync}
        />
      </form>
    </div>
  );
}
