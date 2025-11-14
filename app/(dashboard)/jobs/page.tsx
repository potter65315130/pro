'use client';

import { useState, useEffect } from 'react';
// import JobCard from '@/components/JobCard'; // สมมติว่ามี component แสดงงาน

export default function NearbyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ทำงานครั้งเดียวเมื่อเปิดหน้า
    if (navigator.geolocation) {
      // "ขออนุญาต" และ "ดึงตำแหน่ง" ทันที
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // เมื่อได้ตำแหน่งแล้ว ให้ไปเรียก API 'near-me' ที่เราคุยกัน
          fetch(`/api/jobs/near-me?lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              setJobs(data);
              setLoading(false);
            });
        },
        (error) => {
          // ถ้าผู้ใช้ปฏิเสธ
          console.error("Error getting location:", error);
          alert('เราต้องการตำแหน่งของคุณเพื่อค้นหางาน "ใกล้ฉัน"');
          setLoading(false);
        }
      );
    } else {
      alert('เบราว์เซอร์ของคุณไม่รองรับ Geolocation');
      setLoading(false);
    }
  }, []); // [] หมายถึงให้ทำงานครั้งเดียวตอนโหลด

  if (loading) {
    return <p>กำลังค้นหางานรอบตัวคุณ...</p>;
  }

  return (
    <div>
      <h1>งานพาร์ทไทม์ใกล้ฉัน</h1>
      {/* {jobs.map((job) => (
        <JobCard key={job.job_id} job={job} />
      ))} */}
      {jobs.length === 0 && <p>ไม่พบงานใกล้ตัวคุณในขณะนี้</p>}
    </div>
  );
}