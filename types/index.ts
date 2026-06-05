export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type AuthFormState = {
  message: string;
  success: boolean;
  fieldErrors?: Record<string, string[]>;
};

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
};
