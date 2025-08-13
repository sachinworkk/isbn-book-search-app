export default function Home() {
  return (
    <div className="w-full h-full">
      <form className="p-5 flex flex-col gap-4">
        {/* Search Filed */}
        <div className="relative flex-1">
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
            className="block w-full mt-6 p-4 ps-10 text-sm border border-gray-300 rounded-md bg-gray-50 focus:border-gray-400 focus:outline-none
            focus:shadow-xl
            "
            placeholder="Search Books"
            required
          />
        </div>

        {/* Book List Section */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-400" />
          <div className="mx-4 text-gray-600 uppercase tracking-widest font-medium text-sm flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20h9M3 4h18M3 4v16M3 4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4z"
              />
            </svg>
            <span>Books</span>
          </div>
          <div className="flex-grow border-t border-gray-400" />
        </div>
      </form>
    </div>
  );
}
