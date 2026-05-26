import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { FinancialProduct } from "@/domain/product";
import { ProductForm } from "@/presentation/components/product-form/ProductForm";
import { useProductUseCases } from "@/presentation/context";
import { ProductSkeleton } from "@/presentation/components/product-skeleton/ProductSkeleton";
import { BankLayout } from "@/presentation/shared/layout/bank-layout/BankLayout";
import { Alert } from "@/presentation/shared/ui/alert/Alert";

export default function EditProductPage() {
  const router = useRouter();
  const cases = useProductUseCases();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;
  const [initial, setInitial] = useState<FinancialProduct>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !id) return;
    void (async () => {
      const result = await cases.getProductById(id);
      if (result.success) setInitial(result.value);
      else setError(result.error);
      setLoading(false);
    })();
  }, [router.isReady, id, cases]);

  if (!router.isReady) return null;

  return (
    <BankLayout title="Formulario de Registro">
      {error ? <Alert message={error} /> : null}
      {loading ? (
        <ProductSkeleton rows={3} />
      ) : (
        <ProductForm cases={cases} mode="edit" productId={id} initialData={initial} />
      )}
    </BankLayout>
  );
}
