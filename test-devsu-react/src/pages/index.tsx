import { useRouter } from "next/router";
import { useProductUseCases } from "@/presentation/context";
import { useProducts } from "@/presentation/hooks/use-products";
import { BankLayout } from "@/presentation/shared/layout/bank-layout/BankLayout";
import { Alert } from "@/presentation/shared/ui/alert/Alert";
import { DeleteProductModal } from "@/presentation/components/delete-product-modal/DeleteProductModal";
import { ProductSkeleton } from "@/presentation/components/product-skeleton/ProductSkeleton";
import { ProductTable } from "@/presentation/components/product-table/ProductTable";
import { ProductTableFooter } from "@/presentation/components/product-table-footer/ProductTableFooter";
import { ProductToolbar } from "@/presentation/components/product-toolbar/ProductToolbar";

export default function HomePage() {
  const router = useRouter();
  const cases = useProductUseCases();
  const {
    products,
    loading,
    error,
    search,
    setSearch,
    pageSize,
    setPageSize,
    page,
    setPage,
    totalResults,
    totalPages,
    toDelete,
    openDelete,
    closeDelete,
    confirmDelete,
    deleting,
    deleteError,
  } = useProducts(cases);

  const progress =
    totalResults === 0 ? 0 : Math.min(100, (products.length / totalResults) * 100);

  return (
    <BankLayout>
      <ProductToolbar search={search} onSearchChange={setSearch} />
      {error ? <Alert message={error} /> : null}
      {loading ? (
        <ProductSkeleton rows={pageSize} />
      ) : (
        <>
          <ProductTable
            products={products}
            progressPercent={progress}
            onEdit={(p) => void router.push(`/products/${p.id}/edit`)}
            onDelete={openDelete}
          />
          <ProductTableFooter
            totalResults={totalResults}
            pageSize={pageSize}
            page={page}
            totalPages={totalPages}
            onPageSizeChange={setPageSize}
            onPageChange={setPage}
          />
        </>
      )}
      <DeleteProductModal
        product={toDelete}
        deleting={deleting}
        error={deleteError}
        onClose={closeDelete}
        onConfirm={() => void confirmDelete()}
      />
    </BankLayout>
  );
}
