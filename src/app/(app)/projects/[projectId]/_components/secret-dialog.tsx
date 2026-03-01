'use client';

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
import { TypographyP } from '@/components/ui/typography';
import { Clipboard, Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { createOrUpdateProjectSecretAction } from '../actions';

type SecretDialogProps = {
  trigger: React.ReactNode;
  projectId: string;
  regenerate: boolean;
};

export default function SecretDialog({ trigger, projectId, regenerate }: SecretDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);
  const [rawSecret, setRawSecret] = React.useState<string | null>(null);

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
    setRawSecret(null);
    setShowSecret(false);
  }

  async function handleCreateSecret() {
    try {
      const { rawSecret } = await createOrUpdateProjectSecretAction({ projectId });
      setRawSecret(rawSecret);
    } catch (error) {
      console.error('Failed to create secret:', error);
      toast.error('Failed to create secret');
    }
  }

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
        {rawSecret === null ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {regenerate ? 'Regenerate HMAC Secret' : 'Create HMAC Secret'}
              </DialogTitle>
              <DialogDescription>
                {regenerate
                  ? 'Regenerating will invalidate the previous secret. You will need to update any services using the old secret to use the new one.'
                  : 'Generate a secret to sign the requests with. Requests will be signed using HMAC SHA256. You can verify the signature using your secret.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateSecret}>{regenerate ? 'Regenerate' : 'Create'}</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Secret Created</DialogTitle>
              <DialogDescription>
                Your secret has been {regenerate ? 'updated' : 'created'} successfully. It will only
                be shown this one time. Make sure to copy it and store it securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Your Secret</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    id="api-key"
                    type={showSecret ? 'text' : 'password'}
                    value={rawSecret}
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyToClipboard(rawSecret)}
                  >
                    <Clipboard className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-md p-3">
                <TypographyP className="text-muted-foreground text-sm">
                  <span className="font-semibold">Important:</span> This is the only time you will
                  see this secret. Make sure to copy it and store it securely.
                </TypographyP>
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
