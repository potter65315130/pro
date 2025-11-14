import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path if needed

// This file simply connects your authOptions to NextAuth.js
// and exports the handlers for GET and POST requests.

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };