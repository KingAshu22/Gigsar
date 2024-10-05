import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const Pagination = ({
  className,
  totalPages,
  currentPage,
  setPage,
  ...props
}) => {
  if (totalPages <= 1) return null; // Show pagination only when totalPages > 1

  const generatePageNumbers = () => {
    const pages = [];
    const maxPageToShow = 5; // You can adjust this number
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxPageToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Ensure that the last page is not duplicated
    if (pages[pages.length - 1] !== totalPages && pages.length > 0) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center mt-8", className)}
      {...props}
    >
      <PaginationContent>
        {/* Previous Button */}
        <PaginationPrevious
          onClick={() => currentPage > 1 && setPage(currentPage - 1)}
          className={currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}
        />

        {/* Display first page and ellipsis if needed */}
        {currentPage > 3 && (
          <>
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === 1}
                onClick={() => setPage(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationEllipsis />
          </>
        )}

        {/* Main Page Numbers */}
        {generatePageNumbers().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => setPage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Display last page and ellipsis if needed */}
        {currentPage < totalPages - 2 && (
          <>
            <PaginationEllipsis />
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === totalPages}
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next Button */}
        <PaginationNext
          onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
          className={
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
          }
        />
      </PaginationContent>
    </nav>
  );
};

Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      isActive ? "bg-primary text-white" : "", // Add bg-primary when active
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
