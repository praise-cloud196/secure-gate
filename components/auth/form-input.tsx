"use client";

import { useFormStatus } from "react-dom";
import styles from "./form-input.module.css";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  error,
  onChange,
}: FormInputProps) {
  const { pending } = useFormStatus();

  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={pending}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
