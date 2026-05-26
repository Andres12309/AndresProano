import { PAGE_SIZES, type PageSize } from "@/presentation/hooks/use-products";
import styles from "./ProductTableFooter.module.css";

export function ProductTableFooter({
  totalResults,
  pageSize,
  page,
  totalPages,
  onPageSizeChange,
  onPageChange,
}: {
  totalResults: number;
  pageSize: PageSize;
  page: number;
  totalPages: number;
  onPageSizeChange: (s: PageSize) => void;
  onPageChange: (p: number) => void;
}) {
  return (
    <footer className={styles.footer}>
      <p className={styles.count}>
        {totalResults} Resultado{totalResults === 1 ? "" : "s"}
      </p>
      <div className={styles.controls}>
        {totalPages > 1 ? (
          <nav className={styles.pagination} aria-label="Paginación">
            <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              ‹
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              ›
            </button>
          </nav>
        ) : null}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
          aria-label="Registros por página"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </footer>
  );
}
