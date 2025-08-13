"use client";
import { useState } from "react";
import BookList from "./components/BookList";
import BookSearch from "./components/BookSearch";

interface Book {
  authors: [];
  imageLinks: {};
  publishedDate: string;
  publisher: string;
  title: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  const handleBookSearch = (book: string) => {
    fetch(`http://localhost:8000/books/?isbn=${book}`)
      .then((res) => res.json())
      .then((data) => setBooks((prev) => [...prev, data]));
  };

  return (
    <div className="w-full h-full">
      <form className="p-5 flex flex-col gap-4">
        <BookSearch onBookSearch={handleBookSearch} />
        <BookList />
      </form>
    </div>
  );
}
