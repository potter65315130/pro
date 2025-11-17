import TabBar from '@/components/TabBar';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-20 min-h-screen bg-gray-100">
      {children}
      <TabBar role="shop" />
    </div>
  );
}
