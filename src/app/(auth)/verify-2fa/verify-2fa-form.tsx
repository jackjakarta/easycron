'use client';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    formState: { isSubmitting, errors, isSubmitSuccessful },
    setError,
    watch,
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

    router.replace('/dashboard');
  }

  const codeValue = watch('code');
  const buttonDisabled = codeValue.trim().length === 0 || isSubmitting || isSubmitSuccessful;

  return (
    <div className="flex flex-col gap-6">
      <Card className="z-10 overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">Verify 2FA Code</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="code">2FA Code</Label>
                <Input id="code" placeholder="123456" {...register('code')} />
                {errors.code && (
                  <span className="text-destructive text-sm">{errors.code.message}</span>
                )}
                {errors.root && (
                  <span className="text-destructive text-sm">{errors.root.message}</span>
                )}
              </div>

              <Button type="submit" disabled={buttonDisabled} className="w-full">
                {isSubmitting || isSubmitSuccessful ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://teatrepcqcukbabkenqc.supabase.co/storage/v1/object/public/assets/ChatGPT%20Image%20Aug%2017,%202025,%2008_25_25%20PM.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
