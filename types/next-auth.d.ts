import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: string | null;
    };
  }

  interface User {
    emailVerified?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: string | null;
  }
}
