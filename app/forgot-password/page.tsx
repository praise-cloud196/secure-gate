"use client";

import { useActionState } from "react";
import { forgotPassword } from "@/actions/auth";
import AuthCard from "@/components/auth/auth-card";
import FormInput from "@/components/auth/form-input";
import SubmitButton from "@/components/auth/submit-button";
import StatusMessage from "@/components/auth/status-message";
import AuthLink from "@/components/auth/auth-link";

const initialState = { message: "", success: false };

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPassword, initialState);

  return (
    <AuthCard
      title="Reset password"
      subtitle="Enter your email and we&apos;ll send you a reset link"
    >
      <StatusMessage message={state.message} success={state.success} />
      {!state.success && (
        <form action={formAction}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
          />
          <SubmitButton label="Send reset link" />
        </form>
      )}
      <AuthLink
        text="Remember your password?"
        href="/login"
        linkLabel="Sign in"
      />
    </AuthCard>
  );
}
