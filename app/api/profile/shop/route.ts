import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json({ 
    message: 'Shop Profile API is working. Use POST method to create profile.' 
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📥 Received shop data:', body);

    const { user_id, shop_name, description, address, phone, latitude, longitude } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!user_id) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ user_id' },
        { status: 400 }
      );
    }

    if (!shop_name) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกชื่อร้าน' },
        { status: 400 }
      );
    }

    // ใช้ upsert แทน create
    const profile = await prisma.shopProfile.upsert({
      where: { 
        shop_id: parseInt(user_id) 
      },
      update: {
        shop_name: shop_name,
        description: description || null,
        address: address || null,
        phone: phone || null,
        latitude: latitude && latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude && longitude !== '' ? parseFloat(longitude) : null,
      },
      create: {
        shop_id: parseInt(user_id),
        shop_name: shop_name,
        description: description || null,
        address: address || null,
        phone: phone || null,
        image_path: null,
        latitude: latitude && latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude && longitude !== '' ? parseFloat(longitude) : null,
      },
    });

    console.log('✅ Shop profile saved successfully:', profile);
    return NextResponse.json({ success: true, profile }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error saving shop profile:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });

    return NextResponse.json(
      { 
        success: false,
        message: 'เกิดข้อผิดพลาดในการบันทึกโปรไฟล์ร้านค้า', 
        error: error.message,
        details: error.meta || null
      },
      { status: 500 }
    );
  }
}