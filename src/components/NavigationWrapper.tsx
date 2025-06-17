'use client';

import React from 'react';
import Navigation from './Navigation';
// import { useAuth } from '@/contexts/AuthContext';

export default function NavigationWrapper() {
  // Temporarily disable auth context to fix webpack error
  // const { user, isLoading } = useAuth();
  const user = null;
  const isLoading = false;

  // Show loading state or nothing while auth is initializing
  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PharmaLink
              </span>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <Navigation
      userRole="guest"
      userName={undefined}
      isAuthenticated={false}
    />
  );
}
