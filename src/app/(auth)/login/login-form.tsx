'use client';

import { authClient } from '@/auth/client';
import { socialProviderSchema } from '@/auth/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import SocialAuthButton from '../_components/social-auth-button';

const loginFormSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const router = useRouter();

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
    isSubmitting || isSubmitSuccessful || emailValue.length === 0 || passwordValue.length === 0;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-1 block text-gray-700">
            Email address
          </Label>
          <Input
            id="email"
            type="text"
            {...register('email')}
            placeholder="m@example.com"
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.email && <div>{errors.email.message}</div>}
        </div>
        <div>
          <Label htmlFor="password" className="mb-1 block text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="********"
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.password && <div>{errors.password.message}</div>}
          {errors.root && <div>{errors.root.message}</div>}
        </div>

        <Button
          type="submit"
          disabled={buttonDisabled}
          className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          {isSubmitting || isSubmitSuccessful ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="my-2 flex items-center">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-gray-500">or</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      {socialError !== null && (
        <div className="text-destructive bg-destructive/40 mb-4 rounded-lg px-4 py-2">
          {socialError}
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        {socialProviderSchema.options.map((provider) => (
          <SocialAuthButton
            key={provider}
            provider={provider}
            variant="outline"
            className="w-full"
            onError={() =>
              setSocialError('An error occurred during social login. Please try again.')
            }
          />
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        No account ?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </>
  );
}
