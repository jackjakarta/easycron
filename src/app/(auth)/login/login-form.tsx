'use client';

import { authClient } from '@/auth/client';
import { socialProviderSchema } from '@/auth/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import SocialAuthButton from '../_components/social-auth-button';

export default function LoginForm() {
  const loginFormSchema = useLoginZodSchema();
  type LoginFormData = z.infer<typeof loginFormSchema>;
  const router = useRouter();

  const t = useTranslations('auth.login');
  const tCommon = useTranslations('common');

  const [socialError, setSocialError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(loginData: LoginFormData) {
    const { email: _email, password } = loginData;
    const email = _email.trim().toLowerCase();

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        async onSuccess(context) {
          if (context.data.twoFactorRedirect) {
            router.replace('/verify-2fa');
            return;
          }

          router.replace('/dashboard');
        },
        onError(context) {
          console.error('Login error:', context.error);
          setError('root', { type: 'manual', message: context.error.message });
        },
      },
    );
  }

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const buttonDisabled =
    isSubmitting ||
    isSubmitSuccessful ||
    emailValue.trim().length === 0 ||
    passwordValue.trim().length === 0;

  return (
    <div className="flex flex-col gap-6">
      <Card className="z-10 overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground text-balance">{t('description')}</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">{t('form.email.label')}</Label>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder={t('form.email.placeholder')}
                />
                {errors.email && (
                  <span className="text-destructive text-sm">{errors.email.message}</span>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('form.password.label')}</Label>
                  <Link href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    {t('form.buttons.forgot-password')}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder={t('form.password.placeholder')}
                />
                {errors.root && (
                  <span className="text-destructive text-sm">{errors.root.message}</span>
                )}
              </div>
              <Button type="submit" disabled={buttonDisabled} className="w-full">
                {isSubmitting || isSubmitSuccessful ? 'Logging in...' : t('form.buttons.submit')}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {tCommon('or')} {tCommon('continue').toLowerCase()} {tCommon('with')}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {socialError !== null && (
                  <div className="text-destructive bg-destructive/40 mb-4 rounded-lg px-4 py-2">
                    {socialError}
                  </div>
                )}

                {socialProviderSchema.options.map((provider) => (
                  <SocialAuthButton
                    key={provider}
                    provider={provider}
                    variant="outline"
                    disabled={isSubmitting || isSubmitSuccessful}
                    onError={() =>
                      setSocialError('An error occurred during social login. Please try again.')
                    }
                  />
                ))}
              </div>

              <div className="text-center text-sm">
                {t('form.buttons.no-account')}{' '}
                <Link href="/register" className="underline underline-offset-4">
                  {t('form.buttons.register')}
                </Link>
              </div>
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
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{' '}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}

function useLoginZodSchema() {
  const t = useTranslations('auth.login');

  const loginFormSchema = z.object({
    email: z.email(t('form.email.error')),
    password: z.string().min(1, t('form.password.error')),
  });

  return loginFormSchema;
}
