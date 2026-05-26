import { useCallback, useEffect, useMemo, useState } from "react";
import type { FinancialProduct } from "@/domain/product";
import type { ProductUseCases } from "@/application/product.use-cases";

export const PAGE_SIZES = [5, 10, 20] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

function filterByQuery(products: FinancialProduct[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) =>
    [p.id, p.name, p.description].join(" ").toLowerCase().includes(q)
  );
}

export function useProducts(cases: ProductUseCases) {
  const [products, setProducts] = useState<FinancialProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<PageSize>(5);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<FinancialProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await cases.getAllProducts();
    setProducts(result.success ? result.value : []);
    if (!result.success) setError(result.error);
    setLoading(false);
  }, [cases]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => filterByQuery(products, search), [products, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const confirmDelete = useCallback(async () => {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError(null);
    const result = await cases.deleteProduct(toDelete.id);
    setDeleting(false);
    if (!result.success) {
      setDeleteError(result.error);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== toDelete.id));
    setToDelete(null);
  }, [toDelete, cases]);

  return {
    products: paginated,
    loading,
    error,
    search,
    setSearch: (v: string) => {
      setSearch(v);
      setPage(1);
    },
    pageSize,
    setPageSize: (s: PageSize) => {
      setPageSize(s);
      setPage(1);
    },
    page,
    setPage,
    totalResults: filtered.length,
    totalPages,
    reload: load,
    toDelete,
    openDelete: setToDelete,
    closeDelete: () => !deleting && setToDelete(null),
    confirmDelete,
    deleting,
    deleteError,
  };
}
