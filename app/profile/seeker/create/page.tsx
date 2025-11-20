'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Phone, MapPin, Briefcase, Award, Navigation, Loader2, UserCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Import Map แบบ Dynamic (เพื่อไม่ให้ Error window is not defined)
const LocationMap = dynamic(() => import('@/components/LocationMap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">กำลังโหลดแผนที่...</div>
});

// รายการงาน (Dropdown)
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

  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', skills: '', experience: '',
    startDate: '', endDate: '', gender: '', age: '', interested_job: '',
    latitude: '', longitude: '', // เก็บเป็น String ตามเดิมเพื่อให้จัดการง่าย
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ฟังก์ชันแปลงพิกัดเป็นชื่อที่อยู่ (Reverse Geocoding)
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

  // เมื่อมีการเลือกจุดในแผนที่ หรือ ลากหมุด
  const handleMapLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString()
    }));
    // ดึงชื่อที่อยู่ใหม่อัตโนมัติ
    fetchAddressFromCoords(lat, lng);
  };

  // ฟังก์ชันหาตำแหน่งปัจจุบัน (GPS Browser)
  const getCurrentLocation = () => {
    if (!navigator.geolocation) { alert('Browser ไม่รองรับ Geolocation'); return; }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // อัพเดต State และเรียกฟังก์ชันดึงที่อยู่
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

      const formatDate = (d: string) => new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric'});
      formDataToSend.append('available_days', `${formatDate(formData.startDate)} ถึง ${formatDate(formData.endDate)}`);

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'startDate' && key !== 'endDate') formDataToSend.append(key, value);
      });

      if (selectedImage) formDataToSend.append('profile_image', selectedImage);

      const response = await fetch('/api/profile/seeker', { method: 'POST', body: formDataToSend });
      const data = await response.json();

      if (!response.ok) { setError(data.message || 'เกิดข้อผิดพลาด'); setLoading(false); return; }
      router.push('/dashboard/seeker');
    } catch (error) {
      console.error(error); setError('เกิดข้อผิดพลาด'); setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">สร้างโปรไฟล์</h1>
          <p className="text-indigo-100">กรอกข้อมูลให้ครบถ้วนเพื่อเริ่มงาน</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. รูปโปรไฟล์ */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-indigo-50 relative">
                    {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <UserCircle className="w-16 h-16 text-gray-400" />}
                    <label htmlFor="profile-upload" className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center cursor-pointer hover:bg-black/70 transition">เปลี่ยนรูป</label>
                </div>
                <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            {/* 2. ชื่อ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            {/* 3. อายุ/เพศ */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">อายุ *</label>
                    <input type="number" required min="15" max="99" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เพศ *</label>
                    <select required value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="">เลือกเพศ</option>
                        <option value="male">ชาย</option>
                        <option value="female">หญิง</option>
                        <option value="other">อื่นๆ</option>
                    </select>
                </div>
            </div>

            {/* 4. งาน (Dropdown) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">งานที่สนใจ *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select required value={formData.interested_job} onChange={(e) => setFormData({ ...formData, interested_job: e.target.value })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white">
                  <option value="">-- เลือกประเภทงาน --</option>
                  {JOB_OPTIONS.map((job, index) => <option key={index} value={job}>{job}</option>)}
                </select>
              </div>
            </div>

            {/* 5. เบอร์โทร */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์ *</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>

            {/* 6. แผนที่และตำแหน่ง (ปรับปรุงใหม่) */}
            <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">📍 ปักหมุดตำแหน่งที่ตั้ง *</label>
                <button type="button" onClick={getCurrentLocation} disabled={gettingLocation} className="flex items-center gap-2 px-3 py-1.5 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition disabled:opacity-50 text-xs font-medium shadow-sm">
                  {gettingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                  หาตำแหน่งปัจจุบัน
                </button>
              </div>
              
              {/* แสดงแผนที่ */}
              <div className="mb-3 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <LocationMap 
                    latitude={formData.latitude ? parseFloat(formData.latitude) : 13.7563} 
                    longitude={formData.longitude ? parseFloat(formData.longitude) : 100.5018}
                    onLocationSelect={handleMapLocationSelect}
                />
              </div>

              {formData.latitude ? (
                  <div className="text-xs text-green-600 font-medium flex items-center">
                      ✓ พิกัดที่เลือก: {parseFloat(formData.latitude).toFixed(5)}, {parseFloat(formData.longitude).toFixed(5)}
                  </div>
              ) : (
                  <div className="text-xs text-gray-500">
                      * เลื่อนหมุดในแผนที่เพื่อระบุตำแหน่ง หรือกดปุ่มหาตำแหน่งปัจจุบัน
                  </div>
              )}
            </div>

            {/* 7. ที่อยู่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่ *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} placeholder="ที่อยู่จะขึ้นอัตโนมัติเมื่อปักหมุด หรือพิมพ์เพิ่มเติมได้..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            {/* 8. วันที่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ช่วงวันที่สะดวกทำงาน *</label>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" required value={formData.startDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="date" required value={formData.endDate} min={formData.startDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            {/* 9. ทักษะ & 10. ประสบการณ์ */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ทักษะ *</label>
                    <div className="relative"><Award className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><textarea required value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} rows={2} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ประสบการณ์</label>
                    <textarea value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50">
              {loading ? 'กำลังบันทึก...' : 'สร้างโปรไฟล์'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}