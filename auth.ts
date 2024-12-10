import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { saltAndHashPassword, comparePassword } from "./utils/saltAndHashPassword";
import { getUserFromDb } from "./utils/getUserFromDb";
import { createUserInDb } from "./utils/createUserInDb";

export const { handlers, signIn, signOut, auth } = NextAuth({  providers: [
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

        // Check if user exists
        const user = await getUserFromDb(email, password);

        if (user) {
          // User exists and password is correct
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } else {
          // If the user doesn't exist, create a new user
          console.log("user xaina")
          const pwHash = await saltAndHashPassword(password);
          const newUser = await createUserInDb({ email, password: pwHash });
          console.log("New user created:", newUser);
          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          };
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Optional session configuration
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    signOut: "/auth/signout",
    error: "/auth/error", // Error page
  },
});
