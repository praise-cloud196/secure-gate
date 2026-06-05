import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.logo}>SecureGate</h1>
        <p className={styles.tagline}>
          Secure authentication and access management
        </p>
        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryButton}>
            Sign in
          </Link>
          <Link href="/register" className={styles.secondaryButton}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
