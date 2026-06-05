"use client";

import { useFormStatus } from "react-dom";
import styles from "./submit-button.module.css";

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
}

export default function SubmitButton({
  label,
  loadingLabel = "Please wait...",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={styles.button}>
      {pending && <span className={styles.spinner} />}
      {pending ? loadingLabel : label}
    </button>
  );
}
