import styles from "./status-message.module.css";

interface StatusMessageProps {
  message: string;
  success: boolean;
}

export default function StatusMessage({ message, success }: StatusMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`${styles.message} ${success ? styles.success : styles.error}`}
      role="alert"
    >
      {message}
    </div>
  );
}
