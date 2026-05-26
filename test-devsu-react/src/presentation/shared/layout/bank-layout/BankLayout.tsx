import type { ReactNode } from "react";
import { BankHeader } from "../bank-header/BankHeader";
import styles from "./BankLayout.module.css";

export function BankLayout({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <BankHeader />
        <main className={styles.card}>
          {title ? <h1 className={styles.title}>{title}</h1> : null}
          {children}
        </main>
      </div>
    </div>
  );
}
