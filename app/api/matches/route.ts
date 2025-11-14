// app/api/matches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ฟังก์ชันคำนวณระยะทางโดยใช้ Haversine Formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // รัศมีโลกเป็นกิโลเมตร
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // คืนค่าเป็นกิโลเมตร
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// ฟังก์ชันคำนวณคะแนนความเหมาะสม (0-100)
function calculateMatchScore(
  distance: number, // ระยะทางเป็น km
  skillsMatch: number, // % ของทักษะที่ตรง (0-1)
  daysMatch: number, // % ของวันที่ตรง (0-1)
): number {
  // Weight: ระยะทาง 40%, ทักษะ 40%, วัน 20%
  const maxDistance = 20; // ระยะทางสูงสุดที่ยอมรับได้ (20km)
  
  // คะแนนระยะทาง (ยิ่งใกล้ยิ่งดี)
  const distanceScore = Math.max(0, (1 - distance / maxDistance)) * 100;
  
  // คะแนนทักษะ
  const skillScore = skillsMatch * 100;
  
  // คะแนนวันทำงาน
  const dayScore = daysMatch * 100;
  
  // คำนวณคะแนนรวม
  const totalScore = (distanceScore * 0.4) + (skillScore * 0.4) + (dayScore * 0.2);
  
  return Math.round(totalScore);
}

// ฟังก์ชันเช็คทักษะที่ตรงกัน
function checkSkillsMatch(jobDescription: string, seekerSkills: string): number {
  if (!jobDescription || !seekerSkills) return 0;
  
  const jobKeywords = jobDescription.toLowerCase().split(/[\s,]+/);
  const seekerKeywords = seekerSkills.toLowerCase().split(/[\s,]+/);
  
  const matchedSkills = jobKeywords.filter(keyword => 
    seekerKeywords.some(skill => skill.includes(keyword) || keyword.includes(skill))
  );
  
  return jobKeywords.length > 0 ? matchedSkills.length / jobKeywords.length : 0;
}

// ฟังก์ชันเช็ควันทำงานที่ตรงกัน
function checkDaysMatch(jobDays: string, seekerDays: string): number {
  if (!jobDays || !seekerDays) return 0;
  
  const jobDaysList = jobDays.toLowerCase().split(/[\s,]+/);
  const seekerDaysList = seekerDays.toLowerCase().split(/[\s,]+/);
  
  const matchedDays = jobDaysList.filter(day => 
    seekerDaysList.some(seekerDay => seekerDay.includes(day) || day.includes(seekerDay))
  );
  
  return jobDaysList.length > 0 ? matchedDays.length / jobDaysList.length : 0;
}

// POST: สร้างการจับคู่งานสำหรับผู้หางาน
export async function POST(request: NextRequest) {
  try {
    const { seeker_id, max_distance = 20 } = await request.json();

    if (!seeker_id) {
      return NextResponse.json(
        { message: 'กรุณาระบุ seeker_id' },
        { status: 400 }
      );
    }

    // ดึงข้อมูลผู้หางาน
    const seeker = await prisma.jobSeekerProfile.findUnique({
      where: { seeker_id },
    });

    if (!seeker || !seeker.latitude || !seeker.longitude) {
      return NextResponse.json(
        { message: 'ไม่พบข้อมูลผู้หางานหรือไม่มีพิกัดที่ตั้ง' },
        { status: 404 }
      );
    }

    // ดึงงานทั้งหมดที่เปิดรับสมัคร
    const jobs = await prisma.job.findMany({
      where: {
        status: 'open',
      },
      include: {
        shop: true,
        category: true,
      },
    });

    // คำนวณคะแนนสำหรับแต่ละงาน
    const matches = [];

    for (const job of jobs) {
      if (!job.shop.latitude || !job.shop.longitude) continue;

      // คำนวณระยะทาง
      const distance = calculateDistance(
        seeker.latitude,
        seeker.longitude,
        job.shop.latitude,
        job.shop.longitude
      );

      // ถ้าระยะทางเกินกว่าที่กำหนด ให้ข้าม
      if (distance > max_distance) continue;

      // คำนวณความตรงกันของทักษะ
      const skillsMatch = checkSkillsMatch(
        job.description || '',
        seeker.skills || ''
      );

      // คำนวณความตรงกันของวันทำงาน
      const daysMatch = checkDaysMatch(
        job.work_day || '',
        seeker.available_days || ''
      );

      // คำนวณคะแนนรวม
      const matchScore = calculateMatchScore(distance, skillsMatch, daysMatch);

      // บันทึกการจับคู่ลงฐานข้อมูล
      const match = await prisma.match.upsert({
        where: {
          seeker_id_job_id: {
            seeker_id: seeker_id,
            job_id: job.job_id,
          },
        },
        update: {
          match_score: matchScore,
          time_match: new Date(),
        },
        create: {
          seeker_id: seeker_id,
          job_id: job.job_id,
          match_score: matchScore,
        },
      });

      matches.push({
        match_id: match.match_id,
        job_id: job.job_id,
        job_title: job.title,
        shop_name: job.shop.shop_name,
        category: job.category.category_name,
        distance: Math.round(distance * 10) / 10, // ปัดเศษทศนิยม 1 ตำแหน่ง
        match_score: matchScore,
        wage_per_hour: job.wage_per_hour,
        work_day: job.work_day,
      });
    }

    // เรียงตามคะแนนสูงสุด
    matches.sort((a, b) => b.match_score - a.match_score);

    return NextResponse.json({
      message: 'จับคู่งานสำเร็จ',
      matches,
      total: matches.length,
    });
  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการจับคู่งาน' },
      { status: 500 }
    );
  }
}

// GET: ดึงการจับคู่งานที่มีอยู่แล้ว
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seeker_id = searchParams.get('seeker_id');

    if (!seeker_id) {
      return NextResponse.json(
        { message: 'กรุณาระบุ seeker_id' },
        { status: 400 }
      );
    }

    const matches = await prisma.match.findMany({
      where: {
        seeker_id: parseInt(seeker_id),
      },
      include: {
        job: {
          include: {
            shop: true,
            category: true,
          },
        },
      },
      orderBy: {
        match_score: 'desc',
      },
    });

    return NextResponse.json({
      matches: matches.map((match) => ({
        match_id: match.match_id,
        job_id: match.job_id,
        job_title: match.job.title,
        shop_name: match.job.shop.shop_name,
        category: match.job.category.category_name,
        match_score: match.match_score,
        wage_per_hour: match.job.wage_per_hour,
        work_day: match.job.work_day,
        time_match: match.time_match,
      })),
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}