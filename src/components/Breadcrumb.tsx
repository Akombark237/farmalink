'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  className?: string;
  showHome?: boolean;
}

export default function Breadcrumb({ className = '', showHome = true }: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home if requested
    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        isActive: pathname === '/'
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = formatSegmentLabel(segment, pathSegments, index);
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  // Format segment labels for better readability
  const formatSegmentLabel = (segment: string, allSegments: string[], index: number): string => {
    // Handle dynamic routes
    if (segment.startsWith('[') && segment.endsWith(']')) {
      return segment.slice(1, -1); // Remove brackets
    }

    // Custom labels for specific routes
    const labelMap: Record<string, string> = {
      'use-pages': 'Dashboard',
      'authentication': 'Auth',
      'admin_panel': 'Admin',
      'vendors': 'Vendors',
      'public': 'Info',
      'search': 'Search',
      'cart': 'Cart',
      'checkout': 'Checkout',
      'priscriptions': 'Prescriptions',
      'order_history': 'Order History',
      'medical-assistant': 'AI Assistant',
      'heaith': 'Health',
      'tips': 'Tips',
      'pharmacy_dashboard': 'Dashboard',
      'pharmacy_invertory': 'Inventory',
      'pharmacy_order': 'Orders',
      'pharmacy_payments': 'Payments',
      'pharmary_profile': 'Profile',
      'admin_dashboard': 'Dashboard',
      'admin_drogs': 'Medications',
      'admin_pharmacy': 'Pharmacies',
      'admin_reports': 'Reports',
      'admin_setting': 'Settings',
      'admin_user': 'Users',
      'database-viewer': 'Database',
      'test-chat': 'Test Chat',
      'test-chat-simple': 'Simple Chat',
      'login': 'Login',
      'register': 'Register',
      'forgot-password': 'Forgot Password',
      'reset-password': 'Reset Password',
      'about': 'About',
      'contact': 'Contact',
      'privacy': 'Privacy Policy',
      'terms': 'Terms of Service'
    };

    return labelMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            )}
            
            {item.isActive ? (
              <span className="text-gray-900 font-medium flex items-center">
                {index === 0 && showHome && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
              >
                {index === 0 && showHome && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Utility component for page headers with breadcrumbs
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  showBreadcrumb?: boolean;
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  showBreadcrumb = true 
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        {showBreadcrumb && (
          <Breadcrumb className="mb-4" />
        )}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                {description}
              </p>
            )}
          </div>
          
          {children && (
            <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
