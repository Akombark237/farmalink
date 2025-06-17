'use client';

import React from 'react';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export default function BackgroundWrapper({ 
  children, 
  className = '', 
  overlay = true, 
  overlayOpacity = 0.1 
}: BackgroundWrapperProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: 'url(/background-image.jpg)',
          zIndex: -2
        }}
      />
      
      {/* Optional Overlay */}
      {overlay && (
        <div 
          className="fixed inset-0 bg-white"
          style={{
            opacity: overlayOpacity,
            zIndex: -1
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
