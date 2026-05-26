import { ProductForm } from "@/presentation/components/product-form/ProductForm";
import { useProductUseCases } from "@/presentation/context";
import { BankLayout } from "@/presentation/shared/layout/bank-layout/BankLayout";

export default function NewProductPage() {
  const cases = useProductUseCases();
  return (
    <BankLayout title="Formulario de Registro">
      <ProductForm cases={cases} mode="create" />
    </BankLayout>
  );
}
