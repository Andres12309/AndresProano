import { useState } from "react";
import type { FinancialProduct } from "@/domain/product";
import { formatDisplayDate } from "@/domain/dates";
import { ProductRowMenu } from "../product-row-menu/ProductRowMenu";
import styles from "./ProductTable.module.css";

function ProductLogo({ product }: { product: FinancialProduct }) {
  const [failed, setFailed] = useState(false);
  if (product.logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.logo}
        alt={product.name}
        className={styles.logo}
        onError={() => setFailed(true)}
      />
    );
  }
  const initials = product.name.slice(0, 2).toUpperCase() || "PR";
  return <span className={styles.logoFallback}>{initials}</span>;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  progressPercent = 100,
}: {
  products: FinancialProduct[];
  onEdit: (p: FinancialProduct) => void;
  onDelete: (p: FinancialProduct) => void;
  progressPercent?: number;
}) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nombre del producto</th>
            <th>Descripción</th>
            <th>Fecha de liberación</th>
            <th>Fecha de reestructuración</th>
            <th aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className={styles.empty}>
                No hay productos para mostrar.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td className={styles.logoCell}>
                  <ProductLogo product={product} />
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{formatDisplayDate(product.date_release)}</td>
                <td>{formatDisplayDate(product.date_revision)}</td>
                <td className={styles.actionsCell}>
                  <ProductRowMenu
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className={styles.progressBar} aria-hidden="true">
        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
}
