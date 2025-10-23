import React from 'react';

type UseKeyboardShortcutProps = {
  key: string;
  callbackFn: (e: KeyboardEvent) => void;
  withShift?: boolean;
  enabled?: boolean;
};

export function useKeyboardShortcut({
  key,
  callbackFn,
  withShift = false,
  enabled = true,
}: UseKeyboardShortcutProps) {
  React.useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== key) return;
      if (!(e.metaKey || e.ctrlKey)) return;
      if (withShift ? !e.shiftKey : e.shiftKey) return;

      e.preventDefault();
      callbackFn(e);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callbackFn, withShift, enabled]);
}
