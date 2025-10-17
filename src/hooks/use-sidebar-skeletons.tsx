import React from 'react';

export function useSidebarSkeletons(minCount: number = 3, maxCount: number = 8) {
  const baseId = React.useId();

  return React.useMemo(() => {
    // Use the baseId to generate a consistent "random" count
    const hash = hashString(baseId);
    const range = maxCount - minCount + 1;
    const count = minCount + (hash % range);

    return Array.from({ length: count }, (_, i) => `${baseId}-${i}`);
  }, [baseId, minCount, maxCount]);
}

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h >>> 0;
}
