import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./InputField.module.css";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    { label, error, className = "", disabled, id, name, ...props },
    ref
  ) {
    const inputId = id ?? name;

    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={[
            styles.input,
            error ? styles.inputError : "",
            disabled ? styles.inputDisabled : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);
