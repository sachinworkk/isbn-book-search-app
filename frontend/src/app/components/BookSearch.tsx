"use client";

import { Book, SearchState } from "../../types";

import { PLACEHOLDERS } from "../../constants/labels";
import { VALIDATION_MESSAGE } from "../../constants/validation";

type BookSearchProps = {
  state: SearchState;
  books: Book[];
  onScrapForBook: () => void;
  onBookSearch: (book: string) => void;
};

function LoadingSkeleton() {
  return (
    <li className="flex px-4 py-2 w-full hover:bg-gray-100 cursor-pointer text-sm">
      <div className="flex w-full animate-pulse space-x-4">
        <div className="w-32 h-32 bg-gray-200"></div>
        <div className="flex-2 space-y-6 py-1">
          <div className="h-2 w-full rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-gray-200"></div>
              <div className="col-span-1 h-2 rounded bg-gray-200"></div>
            </div>
            <div className="h-2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </li>
  );
}

function BookItem({ book }: { book: Book }) {
  return (
    <li className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
      <img
        src={
          book?.imageLinks?.smallThumbnail ||
          "https://placehold.co/130x200?text=Book+Cover+Not+Found"
        }
        alt={book?.title}
        className="w-20 h-auto"
      />
      <div className="flex-2 ml-2">
        <span className="text-lg font-semibold">{book.title}</span>
        <div className="book-author flex gap-1 items-baseline text-xs text-gray-500">
          <span>by</span>
          {book?.authors.map((author, idx) => (
            <span key={idx}>
              {author}
              {idx !== book?.authors.length - 1 && ","}
            </span>
          ))}
        </div>
        <span className="text-gray-500 text-xs">
          ISBN Number:{" "}
          {book.industryIdentifiers?.[0]?.identifier ||
            book.industryIdentifiers?.[1]?.identifier ||
            "N/A"}
        </span>
      </div>
    </li>
  );
}

export default function BookSearch({
  onBookSearch,
  onScrapForBook,
  books,
  state,
}: BookSearchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBookSearch(e.target.value.trim());
  };

  const messageCardStyle =
    "absolute z-10 mt-1 w-full  px-4 py-3 text-center text-gray-500";

  return (
    <div className="relative">
      <div className="absolute top-11 left-0 ps-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>

      <input
        type="search"
        id="default-search"
        className="block w-full mt-6 p-4 ps-10 text-sm border border-gray-300 rounded-md bg-gray-50 focus:border-gray-400 focus:outline-none focus:shadow-xl"
        placeholder="Search Books"
        onChange={handleChange}
      />

      {state === "idle" && (
        <span className={`${messageCardStyle}`}>{PLACEHOLDERS.ISBN_INPUT}</span>
      )}

      {state === "notFound" && (
        <div
          className={`${messageCardStyle}  mt-2 px-4 py-3 border border-yellow-300 bg-yellow-50 rounded-lg flex flex-col items-center text-center space-y-2`}
        >
          <p className="text-yellow-800 font-semibold text-lg">
            {VALIDATION_MESSAGE.BOOK_NOT_FOUND}
          </p>
          <button
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white text-sm font-medium shadow hover:bg-blue-600 transition-colors"
            onClick={onScrapForBook}
          >
            {PLACEHOLDERS.SCRAPING_BUTTON}
          </button>
        </div>
      )}

      {state === "scrapingNotFound" && (
        <div className="mt-2 px-4 py-2 border border-red-300 bg-red-50 rounded-lg">
          <h1 className="text-red-600 font-medium">
            {VALIDATION_MESSAGE.NO_LUCK}
          </h1>
          <p className="text-gray-600 text-sm">
            {VALIDATION_MESSAGE.SCRAPING_NOT_FOUND}
          </p>
        </div>
      )}

      {/* Books list */}
      {(state === "success" || state === "loading" || state === "scraping") && (
        <ul className="absolute z-10 mt-1 w-full max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg divide-y divide-gray-100 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
          {state === "loading" || state === "scraping" ? (
            <LoadingSkeleton />
          ) : (
            books.map((book) => <BookItem key={book.id} book={book} />)
          )}
        </ul>
      )}
    </div>
  );
}
