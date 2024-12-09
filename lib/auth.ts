import { NextAuthOptions, Session } from "next-auth";
import AzureADProvider from 'next-auth/providers/azure-ad';

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
            role?: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
            authorization: {
                params: { scope: 'openid email profile User.Read offline_access' },
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            return user.email?.endsWith("@khec.edu.np") ?? false;
        },
        async jwt({ token, user }: { token: any, user?: any }) {
            if (user) {
                token.role = getRoleFromEmail(user.email ?? undefined);
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: any }) {
            if (token.role && session.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
};