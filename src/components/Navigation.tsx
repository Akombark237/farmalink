'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
  Store,
  Shield,
  Database,
  Phone,
  Info,
  Lock,
  UserPlus,
  Activity,
  Stethoscope,
  Building2,
  ClipboardList,
  Bell,
  ChevronDown,
  Truck
} from 'lucide-react';
import SimpleNotificationCenter from './SimpleNotificationCenter';
import ClientOnly from './ClientOnly';

export default function Navigation() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Get user role and name from auth context
  const userRole = user?.role || 'guest';
  const userName = user?.name;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);

  const getNavigationItems = () => {
    const baseItems = [
      { href: '/', label: 'Home', icon: Home },
      { href: '/use-pages/search', label: 'Search', icon: Search },
      { href: '/public/about', label: 'About', icon: Info },
      { href: '/public/contact', label: 'Contact', icon: Phone },
    ];

    if (userRole === 'guest' || !isAuthenticated) {
      return [
        ...baseItems,
        { href: '/authentication/login', label: 'Login', icon: User },
        { href: '/authentication/register', label: 'Register', icon: UserPlus },
      ];
    }

    if (userRole === 'patient') {
      return [
        { href: '/use-pages/dashboard', label: 'Dashboard', icon: Home },
        { href: '/use-pages/search', label: 'Search', icon: Search },
        { href: '/use-pages/cart', label: 'Cart', icon: ShoppingCart },
        { href: '/use-pages/priscriptions', label: 'Prescriptions', icon: Pill },
        { href: '/use-pages/order_history', label: 'Orders', icon: History },
        { href: '/use-pages/medical-assistant', label: 'AI Assistant', icon: MessageSquare },
        { href: '/use-pages/heaith/tips', label: 'Health Tips', icon: Heart },
      ];
    }

    if (userRole === 'admin') {
      return [
        { href: '/admin_panel/admin_dashboard', label: 'Dashboard', icon: BarChart3 },
        { href: '/admin_panel/admin_user', label: 'Users', icon: Users },
        { href: '/admin_panel/admin_pharmacy', label: 'Pharmacies', icon: Building2 },
        { href: '/admin_panel/admin_drogs', label: 'Medications', icon: Pill },
        { href: '/admin_panel/admin_reports', label: 'Reports', icon: FileText },
        { href: '/admin_panel/admin_setting', label: 'Settings', icon: Settings },
        { href: '/database-viewer', label: 'Database', icon: Database },
      ];
    }

    if (userRole === 'pharmacy') {
      return [
        { href: '/vendors/pharmacy_dashboard', label: 'Dashboard', icon: BarChart3 },
        { href: '/vendors/pharmacy_invertory', label: 'Inventory', icon: Package },
        { href: '/vendors/pharmacy_order', label: 'Orders', icon: ClipboardList },
        { href: '/vendors/pharmacy_payments', label: 'Payments', icon: CreditCard },
        { href: '/vendors/pharmary_profile', label: 'Profile', icon: Store },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'pharmacy':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">PharmaLink</div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
              P
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PharmaLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              // Show Login/Register buttons when not authenticated
              <>
                <Link
                  href="/authentication/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/authentication/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              // Show user menu when authenticated
              <>
                {/* Notification Center */}
                <ClientOnly>
                  <SimpleNotificationCenter userId={user?.id} />
                </ClientOnly>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors"
                  >
                    {/* User Avatar */}
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getUserInitials(userName || 'U')}
                    </div>

                    {/* User Info */}
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {userName}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(userRole)}`}>
                          {userRole}
                        </span>
                      </div>
                    </div>

                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                            {getUserInitials(userName || 'U')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{userName}</div>
                            <div className="text-sm text-gray-500">{user?.email}</div>
                            <div className="flex items-center space-x-1 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(userRole)}`}>
                                {userRole}
                              </span>
                              {user?.isVerified && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/use-pages/dashboard"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          href="/use-pages/order_history"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          href="/delivery"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Truck className="h-4 w-4" />
                          <span>Delivery Tracking</span>
                        </Link>

                        <Link
                          href="/notifications"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Bell className="h-4 w-4" />
                          <span>Notifications</span>
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-2"></div>

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
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
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile User Info & Logout */}
              {isAuthenticated && (
                <>
                  <div className="px-3 py-2 border-t border-gray-200 mt-4 pt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <User className="h-4 w-4" />
                      <span>Welcome, {userName || 'User'}</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close user dropdown */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
}
