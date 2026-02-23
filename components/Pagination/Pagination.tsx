interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const getPageNumbers = () => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-30 hover:bg-zinc-700 transition"
      >
        &lt;
      </button>

      {/* 첫 페이지 */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="text-zinc-500">...</span>}
        </>
      )}

      {/* 페이지 번호들 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition ${
            currentPage === page
              ? "bg-blue-600 text-white font-bold"
              : "bg-zinc-800 hover:bg-zinc-700 text-white"
          }`}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지 */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="text-zinc-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-30 hover:bg-zinc-700 transition"
      >
        &gt;
      </button>
    </div>
  );
}
