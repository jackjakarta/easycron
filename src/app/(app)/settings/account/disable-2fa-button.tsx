'use client';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const passwordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Disable2FAButton() {
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  async function onSubmit(passwordData: PasswordFormData) {
    const { password } = passwordData;

    const { error } = await authClient.twoFactor.disable({
      password,
    });

    if (error !== null) {
      console.error(error);
      return;
    }

    router.refresh();
  }

  const passwordValue = watch('password');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="max-md:w-full">
          Disable 2FA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
          <DialogDescription>Disable 2FA for your account.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Label htmlFor="password">Enter your password:</Label>
            <Input
              {...register('password')}
              id="password"
              type="password"
              placeholder="Enter your password"
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || passwordValue.trim().length === 0}>
                {isSubmitting ? 'Disabling...' : 'Disable 2FA'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
