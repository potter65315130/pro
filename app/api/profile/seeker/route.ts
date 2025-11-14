import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json({ 
    message: 'Seeker Profile API is working. Use POST method to create profile.' 
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📥 Received seeker data:', body);

    const { user_id, name, phone, address, skills, experience, available_days, latitude, longitude } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!user_id) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ user_id' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกชื่อ-นามสกุล' },
        { status: 400 }
      );
    }

    // ใช้ upsert แทน create (สร้างใหม่หรืออัปเดตถ้ามีอยู่แล้ว)
    const profile = await prisma.jobSeekerProfile.upsert({
      where: { 
        seeker_id: parseInt(user_id) 
      },
      update: {
        name: name,
        phone: phone || null,
        address: address || null,
        skills: skills || null,
        experience: experience || null,
        available_days: available_days || null,
        latitude: latitude && latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude && longitude !== '' ? parseFloat(longitude) : null,
      },
      create: {
        seeker_id: parseInt(user_id),
        name: name,
        phone: phone || null,
        address: address || null,
        skills: skills || null,
        experience: experience || null,
        available_days: available_days || null,
        profile_image: null,
        latitude: latitude && latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude && longitude !== '' ? parseFloat(longitude) : null,
      },
    });

    console.log('✅ Seeker profile saved successfully:', profile);
    return NextResponse.json({ success: true, profile }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error saving seeker profile:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });

    return NextResponse.json(
      { 
        success: false,
        message: 'เกิดข้อผิดพลาดในการบันทึกโปรไฟล์', 
        error: error.message,
        details: error.meta || null
      },
      { status: 500 }
    );
  }
}