"use client";

import styles from "./password-strength.module.css";

interface PasswordStrengthProps {
  password: string;
}

type StrengthLevel = "weak" | "fair" | "strong";

function evaluateStrength(password: string): {
  level: StrengthLevel;
  score: number;
} {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { level: "weak", score: 0 };
  if (score <= 4) return { level: "fair", score: 1 };
  return { level: "strong", score: 2 };
}

const labels: Record<StrengthLevel, string> = {
  weak: "Weak",
  fair: "Fair",
  strong: "Strong",
};

export default function PasswordStrength({
  password,
}: PasswordStrengthProps) {
  if (!password) return null;

  const { level, score } = evaluateStrength(password);
  const segments = [false, false, false];

  for (let i = 0; i <= score; i++) {
    segments[i] = true;
  }

  return (
    <div className={styles.container}>
      <div className={styles.bars} role="progressbar" aria-valuenow={score + 1} aria-valuemin={1} aria-valuemax={3} aria-label={`Password strength: ${labels[level]}`}>
        <span className={`${styles.bar} ${styles[`bar${level}0`]} ${segments[0] ? styles.active : ""}`} />
        <span className={`${styles.bar} ${styles[`bar${level}1`]} ${segments[1] ? styles.active : ""}`} />
        <span className={`${styles.bar} ${styles[`bar${level}2`]} ${segments[2] ? styles.active : ""}`} />
      </div>
      <span className={`${styles.label} ${styles[`label${level}`]}`}>
        {labels[level]}
      </span>
    </div>
  );
}
