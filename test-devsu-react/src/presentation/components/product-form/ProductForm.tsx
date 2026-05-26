import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import {
  emptyProductForm,
  productFormSchema,
  type ProductFormValues,
} from "@/application/product.schema";
import type { FinancialProduct } from "@/domain/product";
import { addRevisionYear } from "@/domain/dates";
import type { ProductUseCases } from "@/application/product.use-cases";
import { Button } from "@/presentation/shared/ui/button/Button";
import { InputField } from "@/presentation/shared/ui/input-field/InputField";
import { Alert } from "@/presentation/shared/ui/alert/Alert";
import styles from "./ProductForm.module.css";

export function ProductForm({
  cases,
  mode,
  productId,
  initialData,
}: {
  cases: ProductUseCases;
  mode: "create" | "edit";
  productId?: string;
  initialData?: FinancialProduct;
}) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData ?? emptyProductForm,
    mode: "onBlur",
  });

  const idField = register("id");
  const releaseDate = watch("date_release");

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  useEffect(() => {
    if (releaseDate) {
      setValue("date_revision", addRevisionYear(releaseDate), { shouldValidate: true });
    }
  }, [releaseDate, setValue]);

  const verifyId = async (id: string) => {
    if (isEdit || id.length < 3) return;
    const result = await cases.verifyProductId(id.trim());
    if (!result.success) setError("id", { message: result.error });
    else if (result.value) setError("id", { message: "ID no válido!" });
  };

  const onSubmit = handleSubmit(async (values) => {
    const product: FinancialProduct = {
      id: values.id.trim(),
      name: values.name.trim(),
      description: values.description.trim(),
      logo: values.logo.trim(),
      date_release: values.date_release,
      date_revision: values.date_revision,
    };

    const result =
      isEdit && productId
        ? await cases.updateProduct(productId, product)
        : await cases.createProduct(product);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }
    await router.push("/");
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {submitError ? <Alert message={submitError} /> : null}
      <hr className={styles.divider} />
      <div className={styles.grid}>
        <InputField
          label="ID"
          disabled={isEdit}
          error={errors.id?.message}
          name={idField.name}
          ref={idField.ref}
          onChange={idField.onChange}
          onBlur={(e) => {
            idField.onBlur(e);
            if (!isEdit) void verifyId(e.target.value);
          }}
        />
        <InputField label="Nombre" error={errors.name?.message} {...register("name")} />
        <InputField
          label="Descripción"
          error={errors.description?.message}
          {...register("description")}
        />
        <InputField label="Logo" error={errors.logo?.message} {...register("logo")} />
        <InputField
          label="Fecha Liberación"
          type="date"
          error={errors.date_release?.message}
          {...register("date_release")}
        />
        <InputField
          label="Fecha Revisión"
          type="date"
          disabled
          error={errors.date_revision?.message}
          {...register("date_revision")}
        />
      </div>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/")}
          style={{
            border: "1px solid #6b7280",
          }}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset(initialData ?? emptyProductForm)}
        >
          Reiniciar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting || !isValid || !isDirty}>
          {isEdit ? "Actualizar" : "Enviar"}
        </Button>
      </div>
    </form>
  );
}
