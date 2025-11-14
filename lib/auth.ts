import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 Attempting login with:', credentials?.email); // เพิ่ม log

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
        }

        try {
          // หา user จาก email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { role: true },
          });

          console.log('👤 User found:', user ? 'Yes' : 'No'); // เพิ่ม log

          if (!user) {
            console.log('❌ User not found');
            throw new Error('ไม่พบผู้ใช้งาน');
          }

          // เช็ครหัสผ่าน
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          console.log('🔑 Password valid:', isPasswordValid); // เพิ่ม log

          if (!isPasswordValid) {
            console.log('❌ Invalid password');
            throw new Error('รหัสผ่านไม่ถูกต้อง');
          }

          console.log('✅ Login successful'); // เพิ่ม log

          // Return user object
          return {
            id: user.user_id.toString(),
            email: user.email,
            roleId: user.role_id,
          };
        } catch (error) {
          console.error('❌ Authorize error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('🎫 JWT Callback - User:', user); // เพิ่ม log
      if (user) {
        token.id = user.id;
        token.roleId = user.roleId;
        token.email = user.email;
      }
      console.log('🎫 JWT Token:', token); // เพิ่ม log
      return token;
    },
    async session({ session, token }) {
      console.log('📋 Session Callback - Token:', token); // เพิ่ม log
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roleId = token.roleId as number;
        session.user.email = token.email as string;
      }
      console.log('📋 Session:', session); // เพิ่ม log
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // เปิด debug mode
};