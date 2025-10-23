// src/components/ui/Pagination.jsx
import { useEffect } from "react";

export default function Pagination({ page, setPage }) {
  useEffect(() => {
    const handler = (e) => {
      if (e?.detail) {
        setPage(e.detail);
      }
    };
    window.addEventListener("pageChange", handler);
    return () => window.removeEventListener("pageChange", handler);
  }, [setPage]);

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
        disabled={page <= 1}
      >
        Previous
      </button>

      <div className="text-sm text-gray-700">Page {page}</div>

      <button onClick={() => setPage(page + 1)} className="px-3 py-1 rounded border bg-white hover:bg-gray-50">
        Next
      </button>
    </div>
  );
}
