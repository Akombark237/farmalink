'use client';

import React from 'react';
import Link from 'next/link';

export interface PageInfo {
  path: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  userType: 'public' | 'patient' | 'pharmacy' | 'admin';
  status: 'active' | 'development' | 'planned';
}

export const SITE_PAGES: PageInfo[] = [
  // PUBLIC PAGES
  {
    path: '/',
    title: 'Homepage',
    description: 'Main landing page with hero section and features',
    icon: '🏠',
    category: 'Public',
    userType: 'public',
    status: 'active'
  },
  {
    path: '/public/about',
    title: 'About Us',
    description: 'Information about PharmaLink platform',
    icon: 'ℹ️',
    category: 'Public',
    userType: 'public',
    status: 'development'
  },
  {
    path: '/public/contact',
    title: 'Contact',
    description: 'Contact information and support',
    icon: '📞',
    category: 'Public',
    userType: 'public',
    status: 'development'
  },

  // AUTHENTICATION
  {
    path: '/authentication/login',
    title: 'Login',
    description: 'User authentication page',
    icon: '🔑',
    category: 'Authentication',
    userType: 'public',
    status: 'active'
  },
  {
    path: '/authentication/register',
    title: 'Register',
    description: 'New user registration',
    icon: '✍️',
    category: 'Authentication',
    userType: 'public',
    status: 'active'
  },

  // PATIENT PAGES
  {
    path: '/use-pages/dashboard',
    title: 'Patient Dashboard',
    description: 'Main dashboard with health metrics and quick actions',
    icon: '📊',
    category: 'Patient',
    userType: 'patient',
    status: 'active'
  },
  {
    path: '/use-pages/search',
    title: 'Search Medications',
    description: 'Search for medications across pharmacies',
    icon: '🔍',
    category: 'Patient',
    userType: 'patient',
    status: 'active'
  },
  {
    path: '/use-pages/pharmacies',
    title: 'Browse Pharmacies',
    description: 'Find and browse local pharmacies',
    icon: '🏪',
    category: 'Patient',
    userType: 'patient',
    status: 'active'
  },
  {
    path: '/use-pages/prescriptions',
    title: 'Prescriptions',
    description: 'Manage digital prescriptions and refills',
    icon: '📋',
    category: 'Patient',
    userType: 'patient',
    status: 'active'
  },
  {
    path: '/use-pages/cart',
    title: 'Shopping Cart',
    description: 'Review items before checkout',
    icon: '🛒',
    category: 'Patient',
    userType: 'patient',
    status: 'development'
  },
  {
    path: '/use-pages/checkout',
    title: 'Checkout',
    description: 'Complete medication orders',
    icon: '💳',
    category: 'Patient',
    userType: 'patient',
    status: 'active'
  },
  {
    path: '/use-pages/medical-assistant',
    title: 'AI Medical Assistant',
    description: 'Chat with Qala-Lwazi AI for medical guidance',
    icon: '🤖',
    category: 'Patient',
    userType: 'patient',
    status: 'active'
  },
  {
    path: '/use-pages/health/tips',
    title: 'Health Tips',
    description: 'Educational health articles and tips',
    icon: '💡',
    category: 'Patient',
    userType: 'patient',
    status: 'active'
  },

  // PHARMACY PAGES
  {
    path: '/vendors/pharmacy_dashboard',
    title: 'Pharmacy Dashboard',
    description: 'Pharmacy owner main dashboard',
    icon: '📊',
    category: 'Pharmacy',
    userType: 'pharmacy',
    status: 'development'
  },
  {
    path: '/vendors/pharmacy_inventory',
    title: 'Inventory Management',
    description: 'Manage medication stock and pricing',
    icon: '📦',
    category: 'Pharmacy',
    userType: 'pharmacy',
    status: 'development'
  },
  {
    path: '/vendors/pharmacy_orders',
    title: 'Order Management',
    description: 'Process and fulfill customer orders',
    icon: '📋',
    category: 'Pharmacy',
    userType: 'pharmacy',
    status: 'development'
  },

  // ADMIN PAGES
  {
    path: '/admin_panel/admin_dashboard',
    title: 'Admin Dashboard',
    description: 'System administration overview',
    icon: '👑',
    category: 'Admin',
    userType: 'admin',
    status: 'development'
  },
  {
    path: '/admin_panel/admin_users',
    title: 'User Management',
    description: 'Manage platform users',
    icon: '👥',
    category: 'Admin',
    userType: 'admin',
    status: 'development'
  },
  {
    path: '/admin_panel/admin_pharmacy',
    title: 'Pharmacy Management',
    description: 'Approve and manage pharmacies',
    icon: '🏪',
    category: 'Admin',
    userType: 'admin',
    status: 'development'
  }
];

export default function SiteMap() {
  const categories = [...new Set(SITE_PAGES.map(page => page.category))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-yellow-100 text-yellow-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">PharmaLink Site Map</h1>
        <p className="text-xl text-gray-600">Complete overview of all platform pages and features</p>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{category} Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SITE_PAGES
              .filter(page => page.category === category)
              .map(page => (
                <div key={page.path} className="glass hover-lift p-6 rounded-2xl shadow-soft">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{page.icon}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                      {page.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{page.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{page.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{page.userType}</span>
                    {page.status === 'active' ? (
                      <Link 
                        href={page.path}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        Visit Page →
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm">In Development</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
