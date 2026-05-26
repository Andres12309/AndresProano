import type { FinancialProduct } from "@/domain/product";
import { Alert } from "@/presentation/shared/ui/alert/Alert";
import { Button } from "@/presentation/shared/ui/button/Button";
import { Modal } from "@/presentation/shared/ui/modal/Modal";
import styles from "./DeleteProductModal.module.css";

export function DeleteProductModal({
  product,
  deleting,
  error,
  onClose,
  onConfirm,
}: {
  product: FinancialProduct | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={Boolean(product)}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={deleting}>
            Confirmar
          </Button>
        </>
      }
    >
      {error ? <Alert message={error} /> : null}
      <p className={styles.message}>
        ¿Estas seguro de eliminar el producto <strong>{product?.name}</strong>?
      </p>
    </Modal>
  );
}
