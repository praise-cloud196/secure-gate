import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createVerificationToken(
  email: string
): Promise<string> {
  const token = generateToken();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyEmailToken(
  token: string
): Promise<string | null> {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) return null;

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return null;
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return record.identifier;
}

export async function createPasswordResetToken(
  email: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const token = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyPasswordResetToken(
  token: string
): Promise<string | null> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record) return null;

  if (record.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    return null;
  }

  return record.email;
}

export async function consumePasswordResetToken(
  token: string
): Promise<string | null> {
  const email = await verifyPasswordResetToken(token);
  if (!email) return null;

  await prisma.passwordResetToken.delete({ where: { token } });
  return email;
}
