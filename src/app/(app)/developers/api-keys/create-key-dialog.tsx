'use client';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Clipboard, Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const nameSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type NameFormData = z.infer<typeof nameSchema>;

type CreateKeyDialogProps = {
  trigger: React.ReactNode;
};

export default function CreateKeyDialog({ trigger }: CreateKeyDialogProps) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = React.useState(false);
  const [showKey, setShowKey] = React.useState(false);
  const [rawKey, setRawKey] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setError,
  } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(apiKeyFormData: NameFormData) {
    const { name: _name } = apiKeyFormData;
    const name = _name.trim();

    const { error, data } = await authClient.apiKey.create({
      name,
      prefix: 'ec-',
    });

    if (error !== null) {
      setError('root', { type: 'manual', message: 'The API key could not be created.' });
      toast.error('Error creating API key');
      return;
    }

    setRawKey(data.key);
    queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    toast.success('API key created successfully!');
  }

  function handleCopyToClipboard(text: string) {
    try {
      navigator.clipboard.writeText(text);
      toast.success('API key copied to clipboard');
    } catch (error) {
      console.error('Failed to copy API key:', error);
      toast.error('Failed to copy API key');
    }
  }

  function handleDialogClose({ withClose = false }: { withClose?: boolean } = {}) {
    if (withClose) setIsOpen(false);
    setRawKey(null);
    setShowKey(false);
    reset();
  }

  const nameValue = watch('name');

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleDialogClose();
        setIsOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {rawKey === null ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to access your account programmatically.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">API Key Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter a name for your API key"
                  className={cn(errors.name && 'border-destructive')}
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                {errors.root && <p className="text-destructive text-sm">{errors.root.message}</p>}
              </div>
              <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting || nameValue.trim().length === 0}>
                  {isSubmitting ? 'Creating...' : 'Create API Key'}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Your API key has been created successfully. It will only be shown this one time.
                Make sure to copy it and store it securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Your API Key</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    id="api-key"
                    type={showKey ? 'text' : 'password'}
                    value={rawKey}
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyToClipboard(rawKey)}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-md p-3">
                <p className="text-muted-foreground text-sm">
                  <span className="font-semibold">Important:</span> This is the only time you will
                  see this key. Make sure to copy it and store it securely.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleDialogClose({ withClose: true })}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
