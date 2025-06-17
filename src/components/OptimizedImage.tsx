'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { CDNManager, ImageOptimizer } from '@/utils/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  lazy?: boolean;
  webp?: boolean;
  responsive?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  lazy = true,
  webp = true,
  responsive = true,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  // Generate optimized image sources
  const generateSources = () => {
    const sources = [];
    
    if (webp) {
      // WebP source
      const webpSrc = CDNManager.getImageUrl(src, { width, height, quality });
      const webpSrcSet = responsive ? ImageOptimizer.generateSrcSet(src) : undefined;
      
      sources.push(
        <source
          key="webp"
          srcSet={webpSrcSet || webpSrc}
          sizes={sizes}
          type="image/webp"
        />
      );
    }

    // Fallback source
    const fallbackSrc = CDNManager.getImageUrl(src, { width, height, quality });
    const fallbackSrcSet = responsive ? ImageOptimizer.generateSrcSet(src) : undefined;
    
    return sources;
  };

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate blur placeholder
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple blur placeholder
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>`
    ).toString('base64')}`;
  };

  // Error fallback component
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || 'auto' }}
      >
        <div className="text-gray-500 text-center p-4">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs">Image failed to load</p>
        </div>
      </div>
    );
  }

  // Loading placeholder
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width: width || '100%', height: height || 'auto' }}
      />
    );
  }

  // Use Next.js Image component for optimization
  if (webp && typeof window !== 'undefined') {
    return (
      <div ref={imgRef} className={`relative ${className}`}>
        <picture>
          {generateSources()}
          <Image
            src={CDNManager.getImageUrl(src, { width, height, quality })}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            priority={priority}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
            sizes={sizes}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
        
        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  // Fallback to regular Next.js Image
  return (
    <div ref={imgRef} className={`relative ${className}`}>
      <Image
        src={CDNManager.getImageUrl(src, { width, height, quality })}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
        sizes={sizes}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Preload critical images
export function preloadImage(src: string, options?: { width?: number; height?: number; quality?: number }) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = CDNManager.getImageUrl(src, options);
  document.head.appendChild(link);
}

// Image component with automatic WebP detection
export function AutoOptimizedImage(props: OptimizedImageProps) {
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);

  useEffect(() => {
    // Detect WebP support
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      setSupportsWebP(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }, []);

  if (supportsWebP === null) {
    // Loading state while detecting WebP support
    return (
      <div className={`bg-gray-200 animate-pulse ${props.className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return <OptimizedImage {...props} webp={supportsWebP} />;
}

// Progressive image loading component
export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  className = '',
  ...props
}: OptimizedImageProps & { lowQualitySrc?: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lowQualityLoaded, setLowQualityLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Low quality placeholder */}
      {lowQualitySrc && (
        <OptimizedImage
          src={lowQualitySrc}
          alt={alt}
          className={`absolute inset-0 transition-opacity duration-300 ${
            lowQualityLoaded && !imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          quality={10}
          onLoad={() => setLowQualityLoaded(true)}
          {...props}
        />
      )}
      
      {/* High quality image */}
      <OptimizedImage
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        {...props}
      />
    </div>
  );
}
