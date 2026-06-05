"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import FormInput from "@/components/auth/form-input";
import SubmitButton from "@/components/auth/submit-button";
import StatusMessage from "@/components/auth/status-message";
import AuthLink from "@/components/auth/auth-link";

export default function LoginPage() {
  const router = useRouter();
  const [state, setState] = useState({ message: "", success: false });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(formData: FormData) {
    setFieldErrors({});
    setState({ message: "", success: false });

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email) {
      setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
    }
    if (!password) {
      setFieldErrors((prev) => ({ ...prev, password: "Password is required" }));
    }
    if (!email || !password) return;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setState({
        message: "Invalid email or password",
        success: false,
      });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthCard title="Sign in" subtitle="Welcome back to SecureGate">
      <StatusMessage message={state.message} success={state.success} />
      <form action={handleSubmit}>
        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          error={fieldErrors.email}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={fieldErrors.password}
        />
        <SubmitButton label="Sign in" />
      </form>
      <AuthLink
        text="Don&apos;t have an account?"
        href="/register"
        linkLabel="Sign up"
      />
      <AuthLink
        text=""
        href="/forgot-password"
        linkLabel="Forgot password?"
      />
    </AuthCard>
  );
}
