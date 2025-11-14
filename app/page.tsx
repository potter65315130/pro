import { MapPin, Clock, Star, Users, Briefcase, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Part-Time Match</span>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
              <Link   
                href="/register"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md"
              >
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            ระบบจับคู่งาน Part-time ให้คุณ
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            หางาน Part-time<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              ที่ใช่สำหรับคุณ
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            ระบบจับคู่อัตโนมัติที่ช่วยหางาน Part-time ตามเวลาว่างและระยะทางของคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              เริ่มต้นใช้งานฟรี
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ฟีเจอร์เด่นของเรา
            </h2>
            <p className="text-lg text-gray-600">
              ทุกสิ่งที่คุณต้องการสำหรับการหางาน Part-time
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ระบบ Matching อัจฉริยะ
              </h3>
              <p className="text-gray-600">
                จับคู่งานอัตโนมัติตามเวลาว่างและความสามารถของคุณ
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                คำนวณระยะทาง
              </h3>
              <p className="text-gray-600">
                หางานใกล้บ้านคุณด้วยระบบแผนที่และการคำนวณระยะทาง
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                จัดการเวลาอิสระ
              </h3>
              <p className="text-gray-600">
                กำหนดเวลาว่างของคุณและรับงานที่ตรงกับตารางเวลา
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                สมัครงานง่าย
              </h3>
              <p className="text-gray-600">
                สมัครงานได้ในคลิกเดียว พร้อมติดตามสถานะแบบ Real-time
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ระบบรีวิว
              </h3>
              <p className="text-gray-600">
                อ่านและเขียนรีวิวร้านค้าเพื่อสร้างความเชื่อมั่น
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dashboard แบบ Real-time
              </h3>
              <p className="text-gray-600">
                ติดตามงาน สถิติ และรายได้ของคุณในที่เดียว
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              วิธีการใช้งาน
            </h2>
            <p className="text-lg text-gray-600">
              เริ่มต้นใช้งานได้ง่ายๆ ใน 3 ขั้นตอน
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                สมัครสมาชิก
              </h3>
              <p className="text-gray-600">
                กรอกข้อมูลส่วนตัว เวลาว่าง และที่อยู่ของคุณ
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ดูงานที่แนะนำ
              </h3>
              <p className="text-gray-600">
                ระบบจะจับคู่งานที่เหมาะสมกับคุณโดยอัตโนมัติ
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                สมัครและเริ่มงาน
              </h3>
              <p className="text-gray-600">
                สมัครงานที่ชอบและเริ่มทำงาน Part-time ได้ทันที
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            พร้อมเริ่มต้นหางาน Part-time แล้วหรือยัง?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            สมัครสมาชิกฟรีวันนี้และค้นหางานที่ใช่สำหรับคุณ
          </p>
          <Link 
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            เริ่มต้นใช้งานฟรี
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold text-white">Part-Time Match</span>
          </div>
          <p className="text-sm">
           Part-Time Match. 
          </p>
        </div>
      </footer>
    </div>
  );
}