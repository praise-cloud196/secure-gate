"use client";

import { useState } from "react";
import { useActionState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/actions/auth";
import AuthCard from "@/components/auth/auth-card";
import FormInput from "@/components/auth/form-input";
import SubmitButton from "@/components/auth/submit-button";
import StatusMessage from "@/components/auth/status-message";
import AuthLink from "@/components/auth/auth-link";
import PasswordStrength from "@/components/auth/password-strength";

const initialState = { message: "", success: false };

export default function ResetPasswordPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const router = useRouter();
  const searchParams = use(props.searchParams);
  const token = searchParams.token;

  const [password, setPassword] = useState("");
  const [state, formAction] = useActionState(resetPassword, initialState);

  useEffect(() => {
    if (state.success) {
      const timeout = setTimeout(() => router.push("/login"), 2000);
      return () => clearTimeout(timeout);
    }
  }, [state.success, router]);

  if (!token) {
    return (
      <AuthCard title="Reset password" subtitle="Invalid or missing reset link">
        <StatusMessage
          message="This reset link is invalid. Please request a new one."
          success={false}
        />
        <AuthLink
          text=""
          href="/forgot-password"
          linkLabel="Request new reset link"
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset password" subtitle="Enter your new password">
      <StatusMessage message={state.message} success={state.success} />
      {!state.success && (
        <form action={formAction}>
          <input type="hidden" name="token" value={token} />
          <FormInput
            label="New password"
            name="password"
            type="password"
            placeholder="Enter a strong password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength password={password} />
          <SubmitButton label="Reset password" />
        </form>
      )}
      {state.success && (
        <AuthLink
          text="Redirecting to login..."
          href="/login"
          linkLabel="Sign in with your new password"
        />
      )}
    </AuthCard>
  );
}
