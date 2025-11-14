import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // รับ roleId แทน role_name
    const { email, password, roleId, name } = body;

    // --- Basic Validation ---
    if (!email || !password || !roleId || !name) {
      return NextResponse.json(
        { message: 'กรุณากรอกข้อมูลให้ครบถ้วน (email, password, roleId, name)' },
        { status: 400 }
      );
    }

    // --- Check if user already exists ---
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 409 }
      );
    }

    // ตรวจสอบว่า roleId ถูกต้อง (1 = seeker, 2 = shop)
    if (roleId !== 1 && roleId !== 2) {
      return NextResponse.json(
        { message: 'Role ที่ระบุไม่ถูกต้อง (ต้องเป็น 1 หรือ 2)' },
        { status: 400 }
      );
    }

    // ดึง role จาก roleId
    const role = await prisma.role.findUnique({
      where: { role_id: roleId },
    });

    if (!role) {
      return NextResponse.json(
        { message: 'Role ที่ระบุไม่พบในระบบ' },
        { status: 400 }
      );
    }

    // --- Hash Password ---
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // --- สร้าง User และ Profile พร้อมกันใน Transaction ---
    const result = await prisma.$transaction(async (tx) => {
      // สร้าง User
      const newUser = await tx.user.create({
        data: {
          email: email,
          password_hash: password_hash,
          role_id: roleId,
        },
      });

      // สร้าง Profile ตาม roleId
      if (roleId === 1) {
        // ถ้าเป็นผู้หางาน (roleId = 1)
        await tx.jobSeekerProfile.create({
          data: {
            seeker_id: newUser.user_id,
            name: name,
          },
        });
      } else if (roleId === 2) {
        // ถ้าเป็นร้านค้า (roleId = 2)
        await tx.shopProfile.create({
          data: {
            shop_id: newUser.user_id,
            shop_name: name,
          },
        });
      }

      return {
        user_id: newUser.user_id,
        email: newUser.email,
        role_id: newUser.role_id,
      };
    });

    // --- Return Success ---
    return NextResponse.json(
      {
        user: result,
        message: 'สมัครสมาชิกสำเร็จ',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}