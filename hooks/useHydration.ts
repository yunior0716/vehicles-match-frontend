'use client';

import React, { useEffect, useState } from 'react';

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

export function useIsomorphicLayoutEffect(
  effect: () => void | (() => void),
  deps?: React.DependencyList
) {
  const useLayoutEffect =
    typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

  useLayoutEffect(effect, deps);
}
