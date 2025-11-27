import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// ขยาย (augment) type ของ User
declare module 'next-auth' {
  /**
   * ข้อมูลที่ส่งกลับมาจาก authorize() callback
   * เราต้องเพิ่ม email เข้าไปตรงนี้!
   */
  interface User {
    id: string; // user_id
    roleId: number; // role_id
    email: string;
    name?: string | null;
    image?: string | null;
  }

  /**
   * ข้อมูล Session ที่ใช้ใน Client (เช่นใน React Components)
   */
  interface Session {
    user: {
      id: string;
      roleId: number;
      email: string;
      name?: string | null;
      image?: string | null;
    } & Omit<DefaultSession['user'], 'email' | 'name' | 'image'>;
  }
}

// ขยาย (augment) type ของ JWT
declare module 'next-auth/jwt' {
  /**
   * ข้อมูลที่ถูกเข้ารหัสใน JWT (token)
   */
  interface JWT {
    id: string;
    roleId: number;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}