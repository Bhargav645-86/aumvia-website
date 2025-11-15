import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      businessType?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    businessType?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    businessType?: string;
  }
}
