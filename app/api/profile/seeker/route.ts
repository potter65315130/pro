import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// -------------------------------------------------------
// 1. GET Method: ดึงข้อมูลโปรไฟล์เดิมมาแสดง
// -------------------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  console.log('🔵 GET /api/profile/seeker - user_id:', userId);

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    // 🔧 ใช้ seeker_id (ซึ่งเป็น FK ไปที่ user_id)
    const profile = await prisma.jobSeekerProfile.findUnique({
      where: {
        seeker_id: parseInt(userId),
      },
    });

    console.log('📦 Profile found:', profile);

    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: String(error) }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// -------------------------------------------------------
// 2. POST Method: สร้าง หรือ อัปเดต (Upsert)
// -------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    console.log('🔵 POST /api/profile/seeker');

    // ดึงข้อมูลพื้นฐาน
    const user_id = formData.get('user_id') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const skills = formData.get('skills') as string;
    const experience = formData.get('experience') as string;
    const available_days = formData.get('available_days') as string;

    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;

    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;

    const gender = formData.get('gender') as string;
    const age = formData.get('age') as string;
    const interested_job = formData.get('interested_job') as string;
    const profile_image = formData.get('profile_image') as File | null;

    // Validation
    if (!user_id || !name || !gender || !age || !interested_job) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // --- Image Upload ---
    let imageUrl: string | null = null;
    if (profile_image && profile_image.size > 0) {
      try {
        const timestamp = Date.now();
        const cleanName = profile_image.name.replace(/\s/g, '_');
        const fileName = `seeker_${user_id}_${timestamp}_${cleanName}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'seekers');

        await mkdir(uploadDir, { recursive: true });

        const bytes = await profile_image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);
        imageUrl = `/uploads/seekers/${fileName}`;
        
        console.log('✅ Image uploaded:', imageUrl);
      } catch (uploadError) {
        console.error('❌ Error uploading image:', uploadError);
      }
    }

    // --- Database Upsert ---
    // 🔧 เนื่องจาก seeker_id = user_id (เป็น FK)
    const profile = await prisma.jobSeekerProfile.upsert({
      where: {
        seeker_id: parseInt(user_id), // ✅ ใช้ seeker_id ซึ่งคือ PK
      },
      update: {
        name,
        phone: phone || null,
        address: address || null,
        skills: skills || null,
        experience: experience || null,
        available_days: available_days || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        gender,
        age: parseInt(age),
        interested_job,
        ...(imageUrl && { profile_image: imageUrl }),
        // updated_at จะอัปเดตอัตโนมัติจาก @updatedAt
      },
      create: {
        seeker_id: parseInt(user_id), // ✅ seeker_id รับค่าจาก user_id
        name,
        phone: phone || null,
        address: address || null,
        skills: skills || null,
        experience: experience || null,
        available_days: available_days || null,
        profile_image: imageUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        gender,
        age: parseInt(age),
        interested_job,
        // created_at และ updated_at จะถูกสร้างอัตโนมัติ
      },
    });

    console.log('✅ Profile saved:', profile);

    return NextResponse.json({
      success: true,
      profile,
      message: 'บันทึกโปรไฟล์สำเร็จ'
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error saving seeker profile:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}