interface VerificationEmailProps {
  verificationUrl: string;
}

export default function VerificationEmail({
  verificationUrl,
}: VerificationEmailProps) {
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
        Verify your email
      </h1>
      <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
        Thanks for signing up! Please verify your email address by clicking the
        button below.
      </p>
      <a
        href={verificationUrl}
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
        Verify email
      </a>
      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
          marginTop: "24px",
        }}
      >
        This link expires in 15 minutes. If you did not sign up, you can safely
        ignore this email.
      </p>
    </div>
  );
}
