'use client';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Home, User, Briefcase, FileText, Users, MessageSquare, Bell, Settings } from 'lucide-react';

interface ModernTabBarProps {
  role: 'seeker' | 'shop';
  children?: React.ReactNode;
}

export default function ModernTabBar({ role, children }: ModernTabBarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  console.log('TabBar Session:', session); // Debug log
  const [activeTab, setActiveTab] = useState('/dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const seekerMenuItems = [
    { name: 'งานทั้งหมด', href: '/dashboard/seeker', icon: Home },
    { name: 'สถานะการสมัครงาน', href: '/following', icon: Users },
    { name: 'ประวัติการทำงาน', href: '/applications', icon: Briefcase },
    { name: 'สรุปรายได้', href: '/income', icon: FileText },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
  ];

  const shopMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'จัดการงาน', href: '/manage-jobs', icon: Briefcase },
    { name: 'ผู้สมัครงาน', href: '/applicants', icon: Users },
    { name: 'สรุปรายได้', href: '/income', icon: FileText },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
  ];

  const menuItems = role === 'seeker' ? seekerMenuItems : shopMenuItems;

  const handleNavigation = (href: string) => {
    setActiveTab(href);
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="w-full px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              MatchWork
            </h1>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Notification + User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
                    <h3 className="font-semibold text-gray-800">การแจ้งเตือน</h3>
                    <p className="text-xs text-gray-600 mt-0.5">คุณมี 3 การแจ้งเตือนใหม่</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">มีงานใหม่ที่ตรงกับคุณ</p>
                            <p className="text-xs text-gray-500 mt-1">ร้าน Coffee House กำลังหาพนักงาน</p>
                            <p className="text-xs text-gray-400 mt-1">5 นาทีที่แล้ว</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      ดูทั้งหมด
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Button */}
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 group">
              <Settings className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300" />
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all overflow-hidden">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {session?.user?.name || 'ผู้ใช้งาน'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                        {session?.user?.image ? (
                          <img
                            src={session.user.image}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {session?.user?.name || 'ผู้ใช้งาน'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {session?.user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => handleNavigation('/dashboard/seeker/profile')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">โปรไฟล์</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">ตั้งค่า</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm text-red-600 font-medium">ออกจากระบบ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}