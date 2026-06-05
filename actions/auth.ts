"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "@/lib/validations";
import {
  createVerificationToken,
  verifyEmailToken,
  createPasswordResetToken,
  verifyPasswordResetToken,
} from "@/services/token";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/services/email";
import { rateLimitByKey } from "@/lib/rate-limit";

async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  const forwarded = hdrs.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return hdrs.get("x-real-ip") ?? "127.0.0.1";
}

export async function signUp(
  _prevState: { message: string; success: boolean },
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const ip = await getClientIp();
  const { success: allowed } = await rateLimitByKey(
    `signup:${ip}`,
    5,
    15 * 60 * 1000
  );
  if (!allowed) {
    return { message: "Too many requests. Please try again later.", success: false };
  }

  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError =
      Object.values(fieldErrors).flat().at(0) ?? "Invalid input";
    return { message: firstError, success: false };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { message: "Invalid input", success: false };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = await createVerificationToken(email);
  const emailResult = await sendVerificationEmail(email, token);

  if (!emailResult.success) {
    return {
      message:
        "Account created but verification email could not be sent. Try resending verification.",
      success: false,
    };
  }

  return {
    message: "Account created. Check your email to verify your account.",
    success: true,
  };
}

export async function verifyEmail(
  _prevState: { message: string; success: boolean },
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const parsed = verifyEmailSchema.safeParse({
    token: formData.get("token"),
  });

  if (!parsed.success) {
    return { message: "Invalid token", success: false };
  }

  const email = await verifyEmailToken(parsed.data.token);

  if (!email) {
    return {
      message: "Invalid or expired token",
      success: false,
    };
  }

  return {
    message: "Email verified successfully. You can now log in.",
    success: true,
  };
}

export async function resendVerification(
  _prevState: { message: string; success: boolean },
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const ip = await getClientIp();
  const { success: allowed } = await rateLimitByKey(
    `resend:${ip}`,
    3,
    15 * 60 * 1000
  );
  if (!allowed) {
    return { message: "Too many requests. Please try again later.", success: false };
  }

  const parsed = resendVerificationSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { message: "Invalid input", success: false };
  }

  const token = await createVerificationToken(parsed.data.email);
  const emailResult = await sendVerificationEmail(parsed.data.email, token);

  if (!emailResult.success) {
    return {
      message: "Failed to send verification email. Please try again later.",
      success: false,
    };
  }

  return {
    message: "If an account exists, a verification email has been sent.",
    success: true,
  };
}

export async function forgotPassword(
  _prevState: { message: string; success: boolean },
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const ip = await getClientIp();
  const { success: allowed } = await rateLimitByKey(
    `forgot:${ip}`,
    3,
    15 * 60 * 1000
  );
  if (!allowed) {
    return { message: "Too many requests. Please try again later.", success: false };
  }

  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { message: "Invalid input", success: false };
  }

  const email = parsed.data.email;
  const token = await createPasswordResetToken(email);
  if (token) {
    const { success: emailSent } = await sendPasswordResetEmail(email, token);
    if (!emailSent) {
      console.error("forgotPassword: password reset email failed to send");
    }
  }

  return {
    message: "If an account exists, a password reset email has been sent.",
    success: true,
  };
}

export async function resetPassword(
  _prevState: { message: string; success: boolean },
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const ip = await getClientIp();
  const { success: allowed } = await rateLimitByKey(
    `reset:${ip}`,
    5,
    15 * 60 * 1000
  );
  if (!allowed) {
    return { message: "Too many requests. Please try again later.", success: false };
  }

  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError =
      Object.values(fieldErrors).flat().at(0) ?? "Invalid input";
    return { message: firstError, success: false };
  }

  const { token, password } = parsed.data;

  const email = await verifyPasswordResetToken(token);
  if (!email) {
    return {
      message: "Invalid or expired token",
      success: false,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return {
    message: "Password reset successfully. You can now log in.",
    success: true,
  };
}
