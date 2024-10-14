import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";

const Pagination = ({ totalPages, currentPage, setPage }) => {
  // Function to generate page numbers
  const getPagination = () => {
    const pages = [];

    if (totalPages <= 7) {
      // If there are 7 or fewer pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If there are more than 7 pages
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pagination = getPagination();

  return (
    <div className="flex justify-center items-center mt-4">
      {/* Previous Button */}
      <button
        className={`px-2 py-2 border rounded-lg ${
          currentPage === 1
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-primary hover:text-white"
        }`}
        disabled={currentPage === 1}
        onClick={() => setPage(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </button>

      {/* Page Numbers */}
      <ul className="flex overflow-hidden mx-2 gap-2">
        {pagination.map((page, index) =>
          page === "..." ? (
            <li key={index} className="px-3 py-2">
              {page}
            </li>
          ) : (
            <li
              key={index}
              className={`px-3 py-2 border rounded-lg hover:bg-primary hover:text-white ${
                currentPage === page
                  ? "bg-primary font-bold text-white"
                  : "cursor-pointer"
              }`}
              onClick={() => setPage(page)}
            >
              {page}
            </li>
          )
        )}
      </ul>

      {/* Next Button */}
      <button
        className={`px-2 py-2 border rounded-lg ${
          currentPage === totalPages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-primary hover:text-white"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => setPage(currentPage + 1)}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default Pagination;
