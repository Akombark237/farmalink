'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly component ensures that children are only rendered on the client side.
 * This prevents SSR hydration mismatches for components that use browser-only APIs.
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook to check if component is running on client side
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook to safely access browser APIs
 */
export function useBrowserAPI<T>(
  apiAccessor: () => T,
  fallbackValue: T
): T {
  const [value, setValue] = useState<T>(fallbackValue);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      try {
        setValue(apiAccessor());
      } catch (error) {
        console.warn('Browser API access failed:', error);
        setValue(fallbackValue);
      }
    }
  }, [isClient, apiAccessor, fallbackValue]);

  return value;
}
