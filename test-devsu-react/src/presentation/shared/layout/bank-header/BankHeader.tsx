import styles from "./BankHeader.module.css";

export function BankHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logoRow}>
        <div className={styles.icon} aria-hidden="true">
          <span />
          <span />
        </div>
        <h1 className={styles.title}>BANCO</h1>
      </div>
    </header>
  );
}
