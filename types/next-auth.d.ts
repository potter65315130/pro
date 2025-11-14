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
    email: string; // <-- เพิ่มบรรทัดนี้
  }

  /**
   * ข้อมูล Session ที่ใช้ใน Client (เช่นใน React Components)
   */
  interface Session {
    user: {
      id: string;
      roleId: number;
      // เราอาจจะอยากใช้ email ในหน้าเว็บด้วย ก็เพิ่มตรงนี้
      email: string;
    } & Omit<DefaultSession['user'], 'email'>; // Omit 'email' จาก DefaultSession ถ้ามันซ้ำกัน
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
    // email ก็ควรเก็บใน token ด้วย
    email: string;
  }
}