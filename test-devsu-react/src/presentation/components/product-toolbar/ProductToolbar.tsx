import Link from "next/link";
import { Button } from "@/presentation/shared/ui/button/Button";
import styles from "./ProductToolbar.module.css";

export function ProductToolbar({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
}) {
  return (
    <div className={styles.toolbar}>
      <input
        type="search"
        className={styles.search}
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Buscar productos"
      />
      <Link href="/products/new">
        <Button>Agregar</Button>
      </Link>
    </div>
  );
}
