'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Store, Phone, MapPin, FileText, Tag, Navigation, Loader2 } from 'lucide-react';

export default function CreateShopProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    shop_name: '',
    description: '',
    address: '',
    phone: '',
    category_id: '',
    latitude: '',
    longitude: '',
  });

  const categories = [
    { id: 1, name: 'ร้านอาหาร' },
    { id: 2, name: 'ร้านกาแฟ' },
    { id: 3, name: 'ร้านค้าปลีก' },
    { id: 4, name: 'ร้านสะดวกซื้อ' },
    { id: 5, name: 'ร้านซักรีด' },
    { id: 6, name: 'ร้านเสริมสวย' },
    { id: 7, name: 'อื่นๆ' },
  ];

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
      const response = await fetch('/api/profile/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session?.user?.id,
          ...formData,
          category_id: parseInt(formData.category_id),
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

      // ไปหน้าแดชบอร์ดร้านค้า
      router.push('/dashboard/shop');
    } catch (error) {
      console.error('Error:', error);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4">
            <Store className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">สร้างโปรไฟล์ร้านค้า</h1>
          <p className="text-orange-100">กรอกข้อมูลร้านค้าของคุณเพื่อเริ่มต้นหาพนักงาน</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ชื่อร้าน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อร้าน *
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.shop_name}
                  onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                  placeholder="ร้านกาแฟสดใส"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* ประเภทธุรกิจ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทธุรกิจ *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="">เลือกประเภทธุรกิจ</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* คำอธิบายร้าน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำอธิบายร้าน *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ร้านกาแฟสดใจกลางเมือง บรรยากาศดี เหมาะสำหรับนั่งทำงาน"
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* ตำแหน่งที่ตั้ง */}
            <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  📍 ตำแหน่งที่ตั้งร้าน *
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="Longitude (ลองจิจูด)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
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
                ที่อยู่ร้าน *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                  placeholder="02-123-4567"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : 'สร้างโปรไฟล์ร้านค้า'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}