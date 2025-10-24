'use client';

import { useUserAgent } from '@/hooks/use-user-agent';
import { cn } from '@/utils/tailwind';
import { Command } from 'lucide-react';
import React from 'react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

type ShortcutsDialogProps = {
  trigger?: React.ReactNode;
  buttonRef?: React.ComponentProps<'button'>['ref'];
  hidden?: boolean;
};

export default function ShortcutsDialog({
  trigger,
  buttonRef,
  hidden = false,
}: ShortcutsDialogProps) {
  const { isMacOs } = useUserAgent();
  const platformKey = isMacOs ? 'CMD' : 'CTRL';

  const SHORTCUTS = [
    {
      category: 'Navigation',
      items: [
        { keys: [platformKey, 'K'], description: 'Open command menu' },
        { keys: [platformKey, 'B'], description: 'Toggle sidebar' },
      ],
    },
    {
      category: 'Projects',
      items: [{ keys: [platformKey, 'Shift', 'O'], description: 'New project' }],
    },
    {
      category: 'Utility',
      items: [{ keys: [platformKey, '/'], description: 'Open shortcuts' }],
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            ref={buttonRef}
            type="button"
            variant="outline"
            size="sm"
            className={cn(hidden && 'hidden')}
          >
            <Command className="mr-2 h-4 w-4" />
            Shortcuts
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {SHORTCUTS.map((section) => (
            <div key={section.category} className="space-y-3">
              <h3 className="text-foreground border-border border-b pb-1 text-sm font-semibold">
                {section.category}
              </h3>
              <div className="space-y-1">
                {section.items.map((shortcut, index) => (
                  <ShortcutItem
                    key={index}
                    keys={shortcut.keys}
                    description={shortcut.description}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="bg-muted border-border inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded border px-1.5 text-xs font-medium shadow-sm">
      {children}
    </kbd>
  );
}

function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-foreground text-sm">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <div key={index} className="flex items-center gap-1">
            <ShortcutKey>{key}</ShortcutKey>
            {index < keys.length - 1 && <span className="text-muted-foreground text-xs">+</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
