"use client";

import { v4 as uuidv4 } from "uuid";

interface Book {
  id: string;
  authors: [];
  imageLinks: { smallThumbnail: string; thumbnail: string };
  industryIdentifiers: { type: string; identifier: string }[];
  publishedDate: string;
  publisher: string;
  title: string;
}

type BookSearchProps = {
  isLoading: boolean;
  isScrapping: boolean;
  onScrapForBook: () => void;
  isSearching: boolean;
  onBookSearch: (book: string) => void;
  books: Book[];
};

export default function BookSearch({
  onBookSearch,
  onScrapForBook,
  books,
  isLoading,
  isScrapping,
  isSearching,
}: BookSearchProps) {
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
        className="block w-full mt-6 p-4 ps-10 text-sm border
         border-gray-300 rounded-md bg-gray-50 
        focus:border-gray-400 focus:outline-none focus:shadow-xl"
        placeholder="Search Books"
        onChange={(e) => onBookSearch(e.target.value)}
        required
      />

      <ul className="absolute z-10 mt-1 w-full overflow-auto">
        {!isSearching ? (
          <div className="text-gray-500">Type a book name to search</div>
        ) : isLoading ? (
          <>
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
          </>
        ) : books?.length === 0 && !isScrapping ? (
          <div>
            <h1>Book not found</h1>
            <button
              className="bg-blue-500 py-2 px-4 rounded"
              onClick={(e) => onScrapForBook()}
            >
              Try scrapping
            </button>
          </div>
        ) : (
          books?.map((book) => (
            <li
              key={book.id}
              className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <span>
                <img
                  src={
                    book?.imageLinks?.smallThumbnail
                      ? book?.imageLinks?.smallThumbnail
                      : "https://placehold.co/130x200?text=Book+Cover+Not+Found"
                  }
                ></img>
              </span>
              <div className="flex-2 ml-2">
                <span className="text-lg font-semibold">{book.title}</span>
                <br></br>
                <div className="book-author flex gap-1 items-baseline">
                  <h1 className="inline-block">by</h1>
                  {book?.authors?.map((author, index, array) => (
                    <span className="text-gray-500 text-xs" key={uuidv4()}>
                      {author} {index !== array.length - 1 && ","}
                    </span>
                  ))}
                </div>

                <span className="text-gray-500 text-xs">
                  ISBN Number:{" "}
                  {book?.industryIdentifiers?.[0].identifier ||
                    book?.industryIdentifiers?.[1].identifier}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
