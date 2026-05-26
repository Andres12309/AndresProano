import styles from "./Alert.module.css";

export function Alert({ message }: { message: string }) {
  return (
    <p className={styles.alert} role="alert">
      {message}
    </p>
  );
}
