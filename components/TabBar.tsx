'use client';

import React, { useState } from 'react';
import { Home, User, Briefcase, FileText, Store, Users, Menu, X, Search, Settings, LogOut, MessageSquare, FileCheck } from 'lucide-react';

interface ModernTabBarProps {
  role: 'seeker' | 'shop';
}

export default function ModernTabBar({ role }: ModernTabBarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('/dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const seekerMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'สถานะการสมัครงาน', href: '/applications', icon: Briefcase },
    { name: 'ประวัติการทำงาน', href: '/history', icon: FileText },
    { name: 'สรุปรายได้', href: '/income', icon: FileCheck },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'การติดตาม', href: '/following', icon: Users },
  ];

  const shopMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'จัดการงาน', href: '/manage-jobs', icon: Briefcase },
    { name: 'ผู้สมัครงาน', href: '/applicants', icon: Users },
    { name: 'สรุปรายได้', href: '/income', icon: FileCheck },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
  ];

  const menuItems = role === 'seeker' ? seekerMenuItems : shopMenuItems;

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="w-full px-6 h-20 flex items-center justify-between gap-6">

          {/* Left Section: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-blue-600 whitespace-nowrap">
              PART-TIME MATCH
            </h1>
          </div>

          {/* Center Section: Search bar (จำกัดความกว้าง) */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาเมนู..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full
                     hover:bg-white hover:border-gray-300 focus:bg-white focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          {/* Right Section: Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full 
                           hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm 
                           hover:shadow-md flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>

        </div>
      </header>


      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 pointer-events-none shadow-[0_0_40px_rgba(0,0,0,0.3)]"
        />
      )}


      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-blue-600">PART-TIME MATCH</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                OVERVIEW
              </h3>
              <nav className="space-y-1">
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.href;

                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        setActiveTab(item.href);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Settings Section */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                SETTINGS
              </h3>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 max-w-screen-xl mx-auto">
        {/* Content goes here */}
      </div>
    </div>
  );
}
