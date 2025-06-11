'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  ShoppingCart, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Pill,
  FileText,
  CreditCard,
  History,
  MessageSquare,
  Heart,
  Users,
  BarChart3,
  Package,
  Store
} from 'lucide-react';

interface NavigationProps {
  userRole?: 'user' | 'admin' | 'vendor' | 'guest';
  userName?: string;
}

export default function Navigation({ userRole = 'guest', userName }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const getNavigationItems = () => {
    const baseItems = [
      { href: '/', label: 'Home', icon: Home },
      { href: '/use-pages/search', label: 'Search', icon: Search },
    ];

    if (userRole === 'guest') {
      return [
        ...baseItems,
        { href: '/authentication/login', label: 'Login', icon: User },
        { href: '/authentication/register', label: 'Register', icon: User },
      ];
    }

    if (userRole === 'user') {
      return [
        ...baseItems,
        { href: '/use-pages/dashboard', label: 'Dashboard', icon: Home },
        { href: '/use-pages/cart', label: 'Cart', icon: ShoppingCart },
        { href: '/use-pages/priscriptions', label: 'Prescriptions', icon: Pill },
        { href: '/use-pages/order_history', label: 'Orders', icon: History },
        { href: '/use-pages/medical-assistant', label: 'AI Assistant', icon: MessageSquare },
      ];
    }

    if (userRole === 'admin') {
      return [
        { href: '/admin_panel/admin_dashboard', label: 'Dashboard', icon: BarChart3 },
        { href: '/admin_panel/admin_user', label: 'Users', icon: Users },
        { href: '/admin_panel/admin_pharmacy', label: 'Pharmacies', icon: Store },
        { href: '/admin_panel/admin_drogs', label: 'Medications', icon: Pill },
        { href: '/admin_panel/admin_reports', label: 'Reports', icon: FileText },
        { href: '/admin_panel/admin_setting', label: 'Settings', icon: Settings },
      ];
    }

    if (userRole === 'vendor') {
      return [
        { href: '/vendors/pharmacy_dashboard', label: 'Dashboard', icon: BarChart3 },
        { href: '/vendors/pharmacy_invertory', label: 'Inventory', icon: Package },
        { href: '/vendors/pharmacy_order', label: 'Orders', icon: History },
        { href: '/vendors/pharmacy_payments', label: 'Payments', icon: CreditCard },
        { href: '/vendors/pharmary_profile', label: 'Profile', icon: Store },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    router.push('/authentication/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PharmaLink
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ' + (
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            {userRole !== 'guest' && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <div className="pt-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ' + (
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
