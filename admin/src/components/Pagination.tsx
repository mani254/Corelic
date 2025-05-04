'use client';


interface PaginationProps {
  totalItems: number,
  currentPage: number,
  setPage: (args: number) => void,
  limit?: number | null,
}

const Pagination: React.FC<PaginationProps> = ({ totalItems = 1000, setPage, currentPage = 0, limit }) => {

  if (!limit) limit = totalItems

  const totalPages: number = Math.ceil(totalItems / limit);


  const changePage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, 'ellipsis-start', totalPages);
      } else if (currentPage > totalPages - 4) {
        pages.push(1, 'ellipsis-end', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {
        limit !== totalItems && (
          <>
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-full cursor-pointer ${currentPage === 1 ? ' bg-opacity-60 text-gray-500' : 'g-opacity-65 hover:bg-opacity-100'
                }`}
            >
              Previous
            </button>

            <div className="flex gap-2">
              {renderPageNumbers().map((p, idx) =>
                typeof p === 'string' ? (
                  <span key={`${p}-${idx}`} className="px-4 py-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={`px-3 py-1 rounded-full cursor-pointer ${p === currentPage ? 'bg-primary-500 bg-opacity-80 text-white' : 'bg-gray-100 bg-opacity-65 hover:bg-opacity-100'
                      }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-full cursor-pointer ${currentPage === totalPages ? ' bg-opacity-60 text-gray-500' : 'bg-opacity-65 hover:bg-opacity-100'
                }`}
            >
              Next
            </button>
          </>
        )
      }

      <span className="ml-4 text-gray-600 whitespace-nowrap">
        Showing {Math.min(currentPage * limit, totalItems)} of {totalItems} results
      </span>
    </div>
  );
};

export default Pagination;
