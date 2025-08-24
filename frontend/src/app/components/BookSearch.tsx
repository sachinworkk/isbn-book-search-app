"use client";

interface Book {
  id: string;
  authors: string[];
  imageLinks: { smallThumbnail: string; thumbnail: string };
  industryIdentifiers: { type: string; identifier: string }[];
  publishedDate: string;
  publisher: string;
  title: string;
}

type BookSearchProps = {
  state: SearchState;
  books: Book[];
  onScrapForBook: () => void;
  onBookSearch: (book: string) => void;
};

type SearchState = "idle" | "loading" | "success" | "notFound" | "scraping";

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
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() === "") {
            onBookSearch("");
            return;
          }
          onBookSearch(value);
        }}
      />

      <ul className="absolute z-10 mt-1 w-full max-h-96 overflow-auto">
        {state === "idle" && (
          <div className="text-gray-500 px-4 py-2">
            Type a book name to search
          </div>
        )}

        {state === "loading" && <LoadingSkeleton />}

        {state === "notFound" && (
          <div className="px-4 py-2">
            <h1>Book not found</h1>
            <button
              className="bg-blue-500 py-2 px-4 mt-2 rounded text-white"
              onClick={onScrapForBook}
            >
              Try scraping
            </button>
          </div>
        )}

        {state === "scraping" && <LoadingSkeleton />}

        {state === "success" &&
          books.map((book) => <BookItem key={book.id} book={book} />)}
      </ul>
    </div>
  );
}
