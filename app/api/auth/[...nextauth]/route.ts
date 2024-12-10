import NextAuth from "next-auth";
import { authOptions } from '@/auth'

console.log('authOptions:', authOptions);
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

