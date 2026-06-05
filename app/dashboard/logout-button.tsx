"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        background: "none",
        border: "1px solid var(--color-outline)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-sm) var(--space-lg)",
        cursor: "pointer",
        fontSize: "var(--font-label-medium-font-size)",
        color: "var(--color-on-surface)",
      }}
    >
      Sign out
    </button>
  );
}
