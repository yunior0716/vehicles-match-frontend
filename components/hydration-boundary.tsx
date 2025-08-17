'use client';

import { useHydration } from '@/hooks/useHydration';

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HydrationBoundary({
  children,
  fallback = null,
}: HydrationBoundaryProps) {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
