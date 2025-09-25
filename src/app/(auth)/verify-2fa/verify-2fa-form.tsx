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

const verify2FASchema = z.object({
  code: z.string().min(6, 'Invalid 2FA code').max(6, 'Invalid 2FA code'),
});

type Verify2FAFormData = z.infer<typeof verify2FASchema>;

export default function Verify2FAForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    setError,
    clearErrors,
  } = useForm<Verify2FAFormData>({
    resolver: zodResolver(verify2FASchema),
    defaultValues: { code: '' },
  });

  async function onSubmit(data: Verify2FAFormData) {
    const { code: _code } = data;
    const code = _code.trim();

    const { error } = await authClient.twoFactor.verifyTotp({
      code,
      trustDevice: true,
    });

    if (error !== null) {
      console.error(error);
      setError('root', { type: 'manual', message: error.message });
      return;
    }

    router.replace('/');
  }

  const codeValue = watch('code');

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-4"
        >
          <Label htmlFor="code">Enter 2FA Code:</Label>
          <Input
            {...register('code')}
            id="code"
            onChange={() => {
              clearErrors('code');
              clearErrors('root');
            }}
            placeholder="Enter 2FA code"
          />

          {errors.root && (
            <p className="text-sm text-red-600" role="alert">
              {errors.root.message}
            </p>
          )}

          {errors.code && (
            <p className="text-sm text-red-600" role="alert">
              {errors.code.message}
            </p>
          )}

          <Button type="submit" disabled={false}>
            {isSubmitting ? 'Verifying...' : 'Verify 2FA Code'}
          </Button>
        </form>
      </div>
    </div>
  );
}
