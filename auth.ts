import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { saltAndHashPassword, comparePassword } from "./utils/saltAndHashPassword";
import { getUserFromDb } from "./utils/getUserFromDb";
import { createUserInDb } from "./utils/createUserInDb";

declare module "next-auth" {
  interface User {
    role: "teacher" | "student" | "admin";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        name: { label: "Name", type: "text" }, // 
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        console.log("inside authorize callback");

        if (!credentials) {
          throw new Error("Credentials are missing.");
        }

        const { name, email, password } = credentials;

        if (typeof email !== "string" || typeof password !== "string") {
          throw new Error("Invalid credentials format.");
        }

        if (!email.endsWith("@khec.edu.np")) {
          throw new Error("Email must be a @khec.edu.np domain.");
        }

        let role: "teacher" | "student";
        if (/^[a-zA-Z]+(\.[a-zA-Z]+)?@khec\.edu\.np$/.test(email)) {
          role = "teacher";
        } else if (/^\d+@khec\.edu\.np$/.test(email)) {
          role = "student";
        } else {
          throw new Error("Invalid email format for role assignment.");
        }

        const user = await getUserFromDb(email, password);
        console.log("user: ", user);

        if (user) {
          const passwordMatch = await comparePassword(password, user.password);
          if (!passwordMatch) {
            throw new Error("Invalid email or password.");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as "teacher" | "student",
          };
        } else {
          console.log("User doesn't exist, creating a new user");

          if (!name) {
            throw new Error("Name is required to create a new user.");
          }

          const pwHash = await saltAndHashPassword(password);
          const newUser = await createUserInDb({ name, email, password: pwHash, role });

          console.log("New user created:", newUser);

          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role as "teacher" | "student",
          };
        }
      },
    }),
  ],
  callbacks: {
    // Persist role information in the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // Sync role information to the session
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
