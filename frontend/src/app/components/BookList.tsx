"use client";

export default function BookList() {
  return (
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
  );
}
