import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { saltAndHashPassword, comparePassword } from "./utils/saltAndHashPassword";
import { getUserFromDb } from "./utils/getUserFromDb";
import { createUserInDb } from "./utils/createUserInDb";

declare module "next-auth" {
  interface User {
    role: "teacher" | "student";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        console.log('inside authorize callback')
        if (!credentials) {
          throw new Error("Credentials are missing.");
        }

        const { email, password } = credentials;

        if (typeof email !== "string" || typeof password !== "string") {
          throw new Error("Invalid credentials format.");
        }

        let role: "teacher" | "student";
        if (email.endsWith("@khec.edu.np")) {
          if (/^[a-zA-Z]+(\.[a-zA-Z]+)?@khec\.edu\.np$/.test(email)) {
            role = "teacher";
          } else if (/^\d+@khec\.edu\.np$/.test(email)) {
            role = "student";
          } else {
            throw new Error("Invalid email format for role assignment.");
          }
        } else {
          throw new Error("Email must be a @khec.edu.np domain.");
        }
        const user = await getUserFromDb(email, password);
        console.log("user: ", user);


        if (user) {
          // User exists and password is correct
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          // If the user doesn't exist, create a new user
          console.log("user xaina")
          const pwHash = await saltAndHashPassword(password);
          const newUser = await createUserInDb({ email, password: pwHash, role });
          console.log("New user created:", newUser);
          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role) {
        session.user = {
          ...session.user,
          role: token.role as "teacher" | "student",
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    signOut: "/auth/signout",
    error: "/auth/error", // Error page
  },
});
