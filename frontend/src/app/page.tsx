"use client";
import { useReducer } from "react";
import BookSearch from "./components/BookSearch";

interface Book {
  id: string;
  authors: string[];
  imageLinks: { smallThumbnail: string; thumbnail: string };
  industryIdentifiers: { type: string; identifier: string }[];
  publishedDate: string;
  publisher: string;
  title: string;
}

type SearchState = "idle" | "loading" | "success" | "notFound" | "scraping";

interface State {
  books: Book[];
  query: string;
  status: SearchState;
}

type Action =
  | { type: "START_SEARCH"; query: string }
  | { type: "SEARCH_SUCCESS"; books: Book[] }
  | { type: "SEARCH_NOT_FOUND" }
  | { type: "START_SCRAPING"; query: string }
  | { type: "SCRAPING_SUCCESS"; books: Book[] }
  | { type: "RESET" };

const initialState: State = {
  books: [],
  query: "",
  status: "idle",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_SEARCH":
      return { ...state, status: "loading", query: action.query };
    case "SEARCH_SUCCESS":
      return { ...state, status: "success", books: action.books };
    case "SEARCH_NOT_FOUND":
      return { ...state, status: "notFound", books: [] };
    case "START_SCRAPING":
      return { ...state, status: "scraping", query: action.query };
    case "SCRAPING_SUCCESS":
      return { ...state, status: "success", books: action.books };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleBookSearchAsync = async (book: string) => {
    if (!book.trim()) {
      dispatch({ type: "RESET" });
      return;
    }

    dispatch({ type: "START_SEARCH", query: book });

    try {
      const res = await fetch(`http://localhost:8000/books/?isbn=${book}`);
      const data = await res.json();

      if (!data?.items || data.items.length === 0) {
        dispatch({ type: "SEARCH_NOT_FOUND" });
      } else {
        dispatch({ type: "SEARCH_SUCCESS", books: data.items });
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      dispatch({ type: "SEARCH_NOT_FOUND" });
    }
  };

  const handleScrappingForBook = async () => {
    dispatch({ type: "START_SCRAPING", query: state.query });

    try {
      const res = await fetch(
        `http://localhost:8000/books/scrap?isbn=${state.query}`
      );
      const data = await res.json();

      dispatch({ type: "SCRAPING_SUCCESS", books: data.items || [] });
    } catch (error) {
      console.error("Error scraping books:", error);
      dispatch({ type: "SEARCH_NOT_FOUND" });
    }
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <form className="p-5 w-1/2 mt-8 flex flex-col gap-4">
        <BookSearch
          books={state.books}
          state={state.status}
          onBookSearch={handleBookSearchAsync}
          onScrapForBook={handleScrappingForBook}
        />
      </form>
    </div>
  );
}
