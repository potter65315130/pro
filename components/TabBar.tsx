// components/TabBar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Briefcase, FileText, Store, Users } from 'lucide-react';

interface TabBarProps {
  role: 'seeker' | 'shop';
}

export default function TabBar({ role }: TabBarProps) {
  const pathname = usePathname();

  // แยก tabs ตามบทบาท
  const seekerTabs = [
    { name: 'หน้าหลัก', href: '/dashboard/seeker', icon: Home },
    { name: 'งานที่แมตช์', href: '/dashboard/seeker/matches', icon: Briefcase },
    { name: 'ประวัติสมัคร', href: '/dashboard/seeker/applications', icon: FileText },
    { name: 'โปรไฟล์', href: '/profile/seeker', icon: User },
  ];

  const shopTabs = [
    { name: 'หน้าหลัก', href: '/dashboard/shop', icon: Store },
    { name: 'งานของฉัน', href: '/dashboard/shop/jobs', icon: Briefcase },
    { name: 'ผู้สมัคร', href: '/dashboard/shop/applicants', icon: Users },
    { name: 'โปรไฟล์', href: '/profile/shop', icon: User },
  ];

  const tabs = role === 'seeker' ? seekerTabs : shopTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <ul className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  className={`flex flex-col items-center justify-center h-full transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{tab.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}