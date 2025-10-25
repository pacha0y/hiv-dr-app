'use client';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

import Footer from './Footer';
import Header from './Header';
import NavComponent from './Sidebar';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // true = expanded
  const { loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Redirect if not authenticated (side effect)
  useEffect(() => {
    if (
      !loading &&
      !isAuthenticated &&
      pathname !== '/users/login' &&
      pathname !== '/users/signup'
    ) {
      router.push('/users/login');
    }
  }, [loading, isAuthenticated, pathname, router]);

  // Skip protection for login/signup
  if (pathname === '/users/login' || pathname === '/users/signup')
    return <>{children}</>;

  // Show loading while checking auth
  if (loading || !isAuthenticated) return <div>Loading...</div>;

  return (
    <div className='flex flex-col h-screen'>
      <Header onToggleMenu={toggleSidebar} />
      <div className='flex flex-1'>
        <NavComponent isOpen={sidebarOpen} />
        <main className='flex-1 p-3 overflow-y-auto bg-white'>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
