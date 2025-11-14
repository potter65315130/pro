'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Phone, MapPin, Briefcase, Award, Calendar, Navigation, Loader2 } from 'lucide-react';

export default function CreateSeekerProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    skills: '',
    experience: '',
    available_days: '',
    latitude: '',
    longitude: '',
  });

  // ฟังก์ชันดึงตำแหน่งปัจจุบัน
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง');
      return;
    }

    setGettingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));

        // เรียก Reverse Geocoding API เพื่อแปลงพิกัดเป็นที่อยู่
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          if (data.display_name) {
            setFormData(prev => ({
              ...prev,
              address: data.display_name,
            }));
          }
        } catch (err) {
          console.error('Error getting address:', err);
        }

        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('ไม่สามารถดึงตำแหน่งได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate coordinates
    if (!formData.latitude || !formData.longitude) {
      setError('กรุณาระบุตำแหน่งที่ตั้ง (คลิก "ใช้ตำแหน่งปัจจุบัน" หรือกรอกพิกัดเอง)');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile/seeker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session?.user?.id,
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'เกิดข้อผิดพลาด');
        setLoading(false);
        return;
      }

      // ไปหน้าแดชบอร์ดผู้หางาน
      router.push('/dashboard/seeker');
    } catch (error) {
      console.error('Error:', error);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4">
            <User className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">สร้างโปรไฟล์</h1>
          <p className="text-indigo-100">กรอกข้อมูลของคุณเพื่อเริ่มต้นหางาน</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ชื่อ-นามสกุล */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ-นามสกุล *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="สมชาย ใจดี"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* เบอร์โทรศัพท์ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทรศัพท์ *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081-234-5678"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* ตำแหน่งที่ตั้ง */}
            <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  📍 ตำแหน่งที่ตั้ง *
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
                >
                  {gettingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      กำลังค้นหา...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      ใช้ตำแหน่งปัจจุบัน
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="Latitude (ละติจูด)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="Longitude (ลองจิจูด)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {formData.latitude && formData.longitude && (
                <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                  ✓ ตำแหน่ง: {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                </div>
              )}
            </div>

            {/* ที่อยู่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ที่อยู่ *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* ทักษะ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ทักษะ *
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  required
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="เช่น: พูดภาษาอังกฤษได้, ใช้คอมพิวเตอร์เป็น, ขับรถได้"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* ประสบการณ์ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประสบการณ์การทำงาน
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="เช่น: เคยทำงานร้านกาแฟ 2 ปี, พนักงานขายสินค้า 1 ปี"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* วันที่สามารถทำงานได้ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่สามารถทำงานได้ *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.available_days}
                  onChange={(e) => setFormData({ ...formData, available_days: e.target.value })}
                  placeholder="เช่น: จันทร์-ศุกร์, วันหยุดสุดสัปดาห์"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : 'สร้างโปรไฟล์'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}