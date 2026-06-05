"use client";

import { useState } from "react";
import { useActionState } from "react";
import { signUp } from "@/actions/auth";
import AuthCard from "@/components/auth/auth-card";
import FormInput from "@/components/auth/form-input";
import SubmitButton from "@/components/auth/submit-button";
import StatusMessage from "@/components/auth/status-message";
import AuthLink from "@/components/auth/auth-link";
import PasswordStrength from "@/components/auth/password-strength";

const initialState = { message: "", success: false };

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [state, formAction] = useActionState(signUp, initialState);

  if (state.success) {
    return (
      <AuthCard title="Check your email" subtitle="Almost done!">
        <StatusMessage message={state.message} success={true} />
        <AuthLink
          text="Already verified?"
          href="/login"
          linkLabel="Sign in"
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create account" subtitle="Join SecureGate">
      <StatusMessage message={state.message} success={state.success} />
      <form action={formAction}>
        <FormInput
          label="Name"
          name="name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrength password={password} />
        <SubmitButton label="Create account" />
      </form>
      <AuthLink
        text="Already have an account?"
        href="/login"
        linkLabel="Sign in"
      />
    </AuthCard>
  );
}
