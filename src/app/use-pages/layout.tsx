'use client';

import React from 'react';

export default function UsePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="use-pages-layout">
      {children}
    </div>
  );
}