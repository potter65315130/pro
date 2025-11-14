'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ShopDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">Dashboard - ร้านค้า</h1>
          <div className="space-y-4">
            <p className="text-gray-600">ยินดีต้อนรับ!</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>ID:</strong> {session?.user?.id}</p>
              <p><strong>Email:</strong> {session?.user?.email}</p>
              <p><strong>Role ID:</strong> {session?.user?.roleId}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}