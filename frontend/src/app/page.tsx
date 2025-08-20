"use client";
import { useReducer } from "react";
import { Book, SearchState } from "../types";
import BookSearch from "./components/BookSearch";

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
  | { type: "SCRAPING_NOT_FOUND" }
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
    case "SCRAPING_NOT_FOUND":
      return { ...state, status: "scrapingNotFound", books: [] };
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

      if (!data?.items || data.items.length === 0) {
        dispatch({ type: "SCRAPING_NOT_FOUND" });
      } else {
        dispatch({ type: "SCRAPING_SUCCESS", books: data.items });
      }
    } catch (error) {
      console.error("Error scraping books:", error);
      dispatch({ type: "SCRAPING_NOT_FOUND" });
    }
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <form className="p-5 w-1/2 mt-8 flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow-sm">
          <svg
            className="w-6 h-6 text-green-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z"
              clipRule="evenodd"
            />
          </svg>

          <h1 className="text-green-800 font-semibold text-lg">
            ISBN Book Search App
          </h1>
        </div>

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
