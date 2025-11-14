'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { UserPlus, Mail, Lock, User, AlertCircle, Briefcase, Store } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'seeker', // 'seeker' or 'shop'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ตรวจสอบรหัสผ่าน
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);

    try {
      // 1. สมัครสมาชิก
      const requestBody = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleId: formData.role === 'seeker' ? 1 : 2,
      };
      
      console.log('📤 ข้อมูลที่ส่งไป:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      console.log('📥 Status:', response.status);
      console.log('📥 Response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        setError(data.message || 'เกิดข้อผิดพลาด');
        setLoading(false);
        return;
      }

      // 2. Auto Login หลังสมัครสำเร็จ
      console.log('🔐 กำลัง Login อัตโนมัติ...');
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log('📥 Login Result:', signInResult);

      if (signInResult?.ok) {
        // 3. Redirect ตาม Role
        if (formData.role === 'seeker') {
          console.log('✅ Redirect ไปหน้ากรอกโปรไฟล์ผู้หางาน');
          router.push('/profile/seeker/create');
        } else {
          console.log('✅ Redirect ไปหน้ากรอกโปรไฟล์ร้านค้า');
          router.push('/profile/shop/create');
        }
      } else {
        // ถ้า login ไม่สำเร็จ ให้ไปหน้า login ธรรมดา
        console.log('⚠️ Login ไม่สำเร็จ ไปหน้า Login');
        router.push('/login?registered=true');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4">
            <UserPlus className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">JobMatch</h1>
          <p className="text-indigo-100">สมัครสมาชิกเพื่อเริ่มต้นการหางาน</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            สมัครสมาชิก
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ประเภทบัญชี
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'seeker' })}
                  className={`p-4 border-2 rounded-lg transition ${
                    formData.role === 'seeker'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <Briefcase className={`w-6 h-6 mx-auto mb-2 ${
                    formData.role === 'seeker' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    formData.role === 'seeker' ? 'text-indigo-600' : 'text-gray-600'
                  }`}>
                    ผู้หางาน
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'shop' })}
                  className={`p-4 border-2 rounded-lg transition ${
                    formData.role === 'shop'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <Store className={`w-6 h-6 mx-auto mb-2 ${
                    formData.role === 'shop' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    formData.role === 'shop' ? 'text-indigo-600' : 'text-gray-600'
                  }`}>
                    ร้านค้า
                  </p>
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ-นามสกุล
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="สมชาย ใจดี"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
              />
              <label className="ml-2 text-sm text-gray-600">
                ฉันยอมรับ{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  ข้อกำหนดและเงื่อนไข
                </a>{' '}
                และ{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  นโยบายความเป็นส่วนตัว
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  กำลังสมัครสมาชิก...
                </span>
              ) : (
                'สมัครสมาชิก'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">หรือ</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              มีบัญชีอยู่แล้ว?{' '}
              <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                เข้าสู่ระบบ
              </a>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-indigo-100 text-sm mt-6">
          © 2024 JobMatch. All rights reserved.
        </p>
      </div>
    </div>
  );
}