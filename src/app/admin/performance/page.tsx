'use client';

import React from 'react';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import ClientOnly from '@/components/ClientOnly';

export default function PerformancePage() {
  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50">
        <PerformanceDashboard />
      </div>
    </ClientOnly>
  );
}
