'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Phone, MapPin, Briefcase, Award, Navigation, Loader2, Calendar, Mail } from 'lucide-react';
import dynamic from 'next/dynamic';

// Import Map แบบ Dynamic
const LocationMap = dynamic(() => import('@/components/LocationMap'), { 
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">กำลังโหลดแผนที่...</div>
});

const JOB_OPTIONS = [
  "พนักงานเสิร์ฟ/บริการ", "พนักงานครัว/ล้างจาน", "พนักงานขาย/PC/BA", "แคชเชียร์",
  "แม่บ้าน/ทำความสะอาด", "รปภ./รักษาความปลอดภัย", "พนักงานขับรถ/ส่งของ",
  "พนักงานคลังสินค้า/ยกของ", "ช่างทั่วไป/ซ่อมบำรุง", "งานธุรการ/ประสานงาน", "Staff Event/งานทั่วไป"
];

export default function CreateSeekerProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // เพิ่ม state เพื่อเช็คว่าเป็นการแก้ไขข้อมูลหรือไม่
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', skills: '', experience: '',
    startDate: '', endDate: '', gender: '', age: '', interested_job: '',
    latitude: '', longitude: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 1. ดึงข้อมูลโปรไฟล์ (ถ้ามี) เมื่อ Session พร้อม
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        try {
          // สมมติว่า Endpoint คือ GET /api/profile/seeker?user_id=...
          const response = await fetch(`/api/profile/seeker?user_id=${session.user.id}`);
          
          if (response.ok) {
            const data = await response.json();
            
            // ถ้ามีข้อมูลกลับมา (แสดงว่าเคยสร้างแล้ว) ให้ set ลง state
            if (data) {
              setIsEditMode(true);
              setFormData({
                name: data.name || '',
                phone: data.phone || '',
                address: data.address || '',
                skills: data.skills || '',
                experience: data.experience || '',
                // *สำคัญ: API ควรส่ง start_date/end_date เป็นรูปแบบ YYYY-MM-DD กลับมา
                startDate: data.start_date ? data.start_date.split('T')[0] : '', 
                endDate: data.end_date ? data.end_date.split('T')[0] : '',
                gender: data.gender || '',
                age: data.age || '',
                interested_job: data.interested_job || '',
                latitude: data.latitude || '',
                longitude: data.longitude || '',
              });

              // ถ้ามีรูปเดิม ให้โชว์รูปเดิม
              if (data.profile_image) {
                setImagePreview(data.profile_image); 
                // หมายเหตุ: data.profile_image ควรเป็น URL เต็ม หรือ path ที่ถูกต้อง
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        }
      } else if (session?.user) {
        // กรณีไม่มีข้อมูลเก่า ให้ดึงชื่อจาก Session เหมือนเดิม
        setFormData(prev => ({
          ...prev,
          name: prev.name || (session.user as any).name || '', 
        }));
      }
    };

    fetchProfile();
  }, [session]);

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        if (data.display_name) {
          setFormData(prev => ({ ...prev, address: data.display_name }));
        }
    } catch (err) {
        console.error('Error fetching address:', err);
    }
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString()
    }));
    fetchAddressFromCoords(lat, lng);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { alert('Browser ไม่รองรับ Geolocation'); return; }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, latitude: latitude.toString(), longitude: longitude.toString() }));
        fetchAddressFromCoords(latitude, longitude);
        setGettingLocation(false);
      },
      (err) => {
        console.error(err);
        setGettingLocation(false);
        alert("ไม่สามารถระบุตำแหน่งได้ กรุณาเปิด GPS");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.latitude || !formData.longitude) {
        setError('กรุณาระบุตำแหน่งบนแผนที่'); setLoading(false); return;
    }
    if (!formData.startDate || !formData.endDate) {
        setError('กรุณาระบุช่วงวันที่สะดวกทำงาน'); setLoading(false); return;
    }

    try {
      const formDataToSend = new FormData();
      if (session?.user?.id) formDataToSend.append('user_id', session.user.id.toString());

      // จัดการวันที่
      const formatDate = (d: string) => new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric'});
      formDataToSend.append('available_days', `${formatDate(formData.startDate)} ถึง ${formatDate(formData.endDate)}`);
      
      // *แนะนำ: ส่ง raw date ไปด้วยเพื่อให้ Backend เก็บแยกคอลัมน์ (จะได้ดึงกลับมาแสดงผลได้ง่ายในครั้งหน้า)
      formDataToSend.append('start_date', formData.startDate);
      formDataToSend.append('end_date', formData.endDate);

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'startDate' && key !== 'endDate') formDataToSend.append(key, value);
      });

      if (selectedImage) {
        formDataToSend.append('profile_image', selectedImage);
      }

      // 2. ปรับ Logic การส่งข้อมูล (เลือก Method ตามสถานะ)
      // หากเป็น Edit Mode อาจใช้ PUT หรือใช้ POST เหมือนเดิมถ้า Backend รองรับ Upsert
      const method = 'POST'; 
      const response = await fetch('/api/profile/seeker', { method: method, body: formDataToSend });
      const data = await response.json();

      if (!response.ok) { setError(data.message || 'เกิดข้อผิดพลาด'); setLoading(false); return; }
      
      // บันทึกเสร็จแล้วไปหน้า Dashboard หรือแจ้งเตือน
      router.push('/dashboard/seeker');
    } catch (error) {
      console.error(error); setError('เกิดข้อผิดพลาด'); setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-10 font-sans text-gray-600">
      <div className="w-full max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">
            {isEditMode ? 'แก้ไขโปรไฟล์' : 'สร้างโปรไฟล์'}
          </h1>
          <p className="text-gray-400">
            {isEditMode ? 'อัปเดตข้อมูลส่วนตัวของคุณ' : 'กรอกข้อมูลส่วนตัวเพื่อเริ่มหางาน'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* LEFT COLUMN: Image Profile */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-blue-50 rounded-3xl overflow-hidden shadow-inner border border-blue-100 flex items-center justify-center group">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center text-blue-300">
                        <User className="w-24 h-24 mb-2 opacity-50" />
                        <span className="text-sm">รูปโปรไฟล์</span>
                    </div>
                )}
                {/* Overlay Hover Hint */}
                <label htmlFor="profile-upload" className="absolute inset-0 bg-black/0 hover:bg-black/10 transition cursor-pointer flex items-center justify-center" />
              </div>
              
              <label 
                htmlFor="profile-upload" 
                className="mt-6 px-8 py-2.5 border-2 border-blue-400 text-blue-500 rounded-xl hover:bg-blue-50 transition cursor-pointer font-medium"
              >
                เปลี่ยนรูปโปรไฟล์
              </label>
              <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            {/* RIGHT COLUMN: Form Fields */}
            <div className="md:w-2/3 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-blue-500 font-medium mb-1.5">ชื่อ-นามสกุล</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="ระบุชื่อ-นามสกุล..."
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  />
                </div>

                {/* Interested Job */}
                <div>
                  <label className="block text-blue-500 font-medium mb-1.5">ประเภทงานที่สนใจ</label>
                  <div className="relative">
                    <select 
                      required 
                      value={formData.interested_job} 
                      onChange={(e) => setFormData({ ...formData, interested_job: e.target.value })} 
                      className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none bg-white"
                    >
                      <option value="">-- เลือกประเภทงาน --</option>
                      {JOB_OPTIONS.map((job, index) => <option key={index} value={job}>{job}</option>)}
                    </select>
                    <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-blue-500 font-medium mb-1.5">ทักษะ</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="เช่น ภาษาอังกฤษ, ขับรถ, ชงกาแฟ"
                    value={formData.skills} 
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })} 
                    className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  />
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-blue-500 font-medium mb-1.5">อายุ</label>
                        <input 
                          type="number" 
                          required 
                          min="15" 
                          max="99" 
                          placeholder="ปี"
                          value={formData.age} 
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })} 
                          className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-center" 
                        />
                    </div>
                    <div>
                        <label className="block text-blue-500 font-medium mb-1.5">เพศ</label>
                        <div className="relative">
                            <select 
                                required 
                                value={formData.gender} 
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })} 
                                className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none bg-white"
                            >
                                <option value="">เลือก</option>
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                                <option value="other">อื่นๆ</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-blue-500 font-medium mb-1.5">เบอร์โทรศัพท์</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="0xx-xxx-xxxx"
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  />
                </div>

                {/* Email (Read-only UI match) */}
                <div className="col-span-1 md:col-span-2">
                   <label className="block text-blue-500 font-medium mb-1.5">อีเมล <span className="text-xs text-gray-400 font-normal">(จากระบบ)</span></label>
                   <div className="relative">
                        <input 
                            type="email" 
                            disabled
                            value={session?.user?.email || ''} 
                            placeholder="example@gmail.com"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-500 outline-none" 
                        />
                        <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   </div>
                </div>

                {/* Experience */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-blue-500 font-medium mb-1.5">ประสบการณ์/ประวัติทำงาน</label>
                  <input 
                    type="text" 
                    placeholder="เคยมีประสบการณ์ทำงานที่ไหนมาบ้าง..."
                    value={formData.experience} 
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })} 
                    className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  />
                </div>

                 {/* Address */}
                 <div className="col-span-1 md:col-span-2">
                  <label className="block text-blue-500 font-medium mb-1.5">ที่อยู่ส่วนตัว</label>
                  <textarea 
                    required 
                    rows={3}
                    placeholder="ระบุที่อยู่..."
                    value={formData.address} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                    className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none" 
                  />
                </div>

                {/* Date Range */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-blue-500 font-medium mb-1.5">วันที่พร้อมเริ่มงาน - สิ้นสุด</label>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input type="date" required value={formData.startDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-blue-500 outline-none text-gray-500" />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative flex-1">
                            <input type="date" required value={formData.endDate} min={formData.startDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-blue-500 outline-none text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Location Map & Coords */}
                <div className="col-span-1 md:col-span-2 mt-2">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-blue-500 font-medium">ตำแหน่งปัจจุบัน</label>
                        <button 
                            type="button" 
                            onClick={getCurrentLocation} 
                            disabled={gettingLocation}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-2 transition shadow-sm disabled:opacity-50"
                        >
                             {gettingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                            ใช้ตำแหน่งปัจจุบัน
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4 shadow-sm">
                        <LocationMap 
                            // ใช้ค่าจาก State ถ้ามี ถ้าไม่มีใช้ค่า Default
                            latitude={formData.latitude ? parseFloat(formData.latitude) : 13.7563} 
                            longitude={formData.longitude ? parseFloat(formData.longitude) : 100.5018}
                            onLocationSelect={handleMapLocationSelect}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input readOnly value={formData.latitude || ''} placeholder="ละติจูด..." className="w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-500 text-sm outline-none" />
                        <input readOnly value={formData.longitude || ''} placeholder="ลองจิจูด..." className="w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-500 text-sm outline-none" />
                    </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-6 flex justify-center md:justify-end">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full md:w-auto px-12 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-blue-200 transition disabled:opacity-70"
                >
                  {loading ? 'กำลังบันทึก...' : (isEditMode ? 'อัปเดตข้อมูล' : 'บันทึก')}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}