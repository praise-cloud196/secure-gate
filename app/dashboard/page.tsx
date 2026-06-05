import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LogoutButton from "./logout-button";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  const token = await getToken({
    req: {
      cookies: Object.fromEntries(
        (await cookies()).getAll().map((c) => [c.name, c.value])
      ),
      headers: Object.fromEntries(await headers()),
    } as any,
  });

  if (!token?.email) {
    redirect("/login");
  }

  if (!token.emailVerified) {
    redirect("/verify-email");
  }

  const name = (token.name as string | null) ?? null;
  const email = token.email as string;

  let createdAt: Date | null = null;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { createdAt: true },
    });
    createdAt = user?.createdAt ?? null;
  } catch {
    // DB query is non-critical; proceed with JWT data
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.logo}>SecureGate</h2>
        <LogoutButton />
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Account</h3>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Name</span>
            <span className={styles.fieldValue}>{name}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Email</span>
            <span className={styles.fieldValue}>{email}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Status</span>
            <span className={`${styles.badge} ${styles.badgeVerified}`}>
              Verified
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Joined</span>
            <span className={styles.fieldValue}>
              {createdAt?.toLocaleDateString() ?? "N/A"}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
