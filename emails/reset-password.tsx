interface PasswordResetEmailProps {
  resetUrl: string;
}

export default function PasswordResetEmail({
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "480px",
        margin: "0 auto",
        padding: "32px 24px",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        Reset your password
      </h1>
      <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
        We received a request to reset your password. Click the button below to
        set a new password.
      </p>
      <a
        href={resetUrl}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#111827",
          color: "#ffffff",
          textDecoration: "none",
          borderRadius: "6px",
          fontSize: "16px",
        }}
      >
        Reset password
      </a>
      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
          marginTop: "24px",
        }}
      >
        This link expires in 1 hour. If you did not request a password reset,
        you can safely ignore this email.
      </p>
    </div>
  );
}
