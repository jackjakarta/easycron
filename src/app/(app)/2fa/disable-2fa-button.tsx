'use client';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';
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
        <Button type="submit" disabled={isSubmitting || passwordValue.trim().length === 0}>
          {isSubmitting ? 'Disabling...' : 'Disable 2FA'}
        </Button>
      </form>
    </div>
  );
}
