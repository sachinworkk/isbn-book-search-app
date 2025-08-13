"use client";

type BookSearchProps = {
  onBookSearch: (book: string) => void; // no params, no return value
};

export default function BookSearch({ onBookSearch }: BookSearchProps) {
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
    </div>
  );
}
