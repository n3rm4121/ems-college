// import Credentials from "next-auth/providers/credentials"
// import { saltAndHashPassword } from "./utils/saltAndHashPassword"
// import { getUserFromDb } from "./utils/getUserFromDb"
// import { redirect } from "next/navigation"

import NextAuth, { NextAuthOptions, Session } from "next-auth";
import AzureADProvider from 'next-auth/providers/azure-ad';
import { JWT, DefaultJWT } from "next-auth/jwt";

const env = process.env;

const getRoleFromEmail = (email: string | undefined): string => {
  if (!email) return "guest";

  if (email === "admin@khec.edu.np") {
    return "admin";
  }

  if (email.endsWith("@khec.edu.np")) {
    const [localPart] = email.split("@");
    return isNaN(Number(localPart)) ? "teacher" : "student";
  }

  return "guest";
};

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: `${env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}`,
      clientSecret: `${env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET}`,
      tenantId: `${env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,
      authorization: {
        params: { scope: 'openid email profile User.Read offline_access' },
      },
      httpOptions: { timeout: 10000 },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }
      return user.email.endsWith("@khec.edu.np");
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("User email:", user.email);
        token.role = getRoleFromEmail(user.email ?? undefined);
      }
      console.log("Token in jwt callback:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Token in session callback:", token);
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      console.log("Session returned:", session);
      return session;
    },

  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
