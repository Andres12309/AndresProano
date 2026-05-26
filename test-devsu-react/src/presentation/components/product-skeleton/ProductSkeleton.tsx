import styles from "./ProductSkeleton.module.css";

export function ProductSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.row} />
      ))}
    </div>
  );
}
