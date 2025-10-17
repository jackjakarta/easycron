import { hashStringToNumber } from '@/utils/hash';
import React from 'react';

export function useSidebarSkeletons(minCount: number = 3, maxCount: number = 8) {
  const baseId = React.useId();

  return React.useMemo(() => {
    const hash = hashStringToNumber(baseId);
    const range = maxCount - minCount + 1;
    const count = minCount + (hash % range);

    return Array.from({ length: count }, (_, i) => `${baseId}-${i}`);
  }, [baseId, minCount, maxCount]);
}
