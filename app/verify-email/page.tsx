"use client";

import { useEffect } from "react";
import { useActionState, use } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { verifyEmail, resendVerification } from "@/actions/auth";
import AuthCard from "@/components/auth/auth-card";
import FormInput from "@/components/auth/form-input";
import SubmitButton from "@/components/auth/submit-button";
import StatusMessage from "@/components/auth/status-message";
import AuthLink from "@/components/auth/auth-link";

const initialState = { message: "", success: false };

export default function VerifyEmailPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const router = useRouter();
  const searchParams = use(props.searchParams);
  const token = searchParams.token;

  const [verifyState, verifyAction] = useActionState(verifyEmail, initialState);
  const [resendState, resendAction] = useActionState(
    resendVerification,
    initialState
  );

  const showSuccess = verifyState.success;

  useEffect(() => {
    if (showSuccess) {
      signOut({ redirect: false }).then(() => {
        router.push("/login");
      });
    }
  }, [showSuccess, router]);

  return (
    <AuthCard
      title="Verify email"
      subtitle={
        showSuccess
          ? "Your email has been verified"
          : "Verify your email address to continue"
      }
    >
      <StatusMessage
        message={verifyState.message || resendState.message}
        success={verifyState.success || resendState.success}
      />
      {token && !showSuccess && (
        <form action={verifyAction}>
          <input type="hidden" name="token" value={token} />
          <SubmitButton label="Verify email" />
        </form>
      )}
      {!token && !showSuccess && (
        <>
          <p
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "var(--color-on-surface-variant)",
              fontSize: "var(--font-body-medium-font-size)",
            }}
          >
            Check your inbox for the verification link. If you didn&apos;t
            receive one, you can request a new link below.
          </p>
          <form action={resendAction}>
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
            />
            <SubmitButton label="Resend verification" />
          </form>
        </>
      )}
      {showSuccess && (
        <AuthLink
          text=""
          href="/login"
          linkLabel="Sign in to your account"
        />
      )}
    </AuthCard>
  );
}
