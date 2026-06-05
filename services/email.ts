import { Resend } from "resend";
import VerificationEmail from "@/emails/verification";
import PasswordResetEmail from "@/emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail({ verificationUrl }),
    });

    if (result.error) {
      console.error("Failed to send verification email:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error: "Failed to send verification email" };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your password",
      react: PasswordResetEmail({ resetUrl }),
    });

    if (result.error) {
      console.error("Failed to send password reset email:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error: "Failed to send password reset email" };
  }
}
