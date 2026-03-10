import { ReactNode } from 'react';

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-800">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
