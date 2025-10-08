'use client';

import { socialProviderSchema } from '@/auth/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import SocialAuthButton from '../_components/social-auth-button';
import { registerUserAction } from './actions';

const registerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const router = useRouter();

  const [socialError, setSocialError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    const { email: _email, password, name } = data;
    const email = _email.trim().toLowerCase();

    try {
      await registerUserAction({ name, email, password });
      toast.success('Registration successful! Please check your email to verify your account.');
      router.replace('/login');
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Registration failed. Please try again.',
      });
    }
  }

  const errorMessageClassName = 'text-destructive text-sm';
  const submitButtonDisabled = isSubmitting || isSubmitSuccessful;

  return (
    <div className="flex flex-col gap-6">
      <Card className="z-10 overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-balance">Register with PDF Exporter</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="John Doe" {...register('name')} />
                {errors.name && <div className={errorMessageClassName}>{errors.name.message}</div>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                {errors.email && (
                  <div className={errorMessageClassName}>{errors.email.message}</div>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  {...register('password')}
                />
                {errors.password && (
                  <div className={errorMessageClassName}>{errors.password.message}</div>
                )}
                {errors.root && <div className={errorMessageClassName}>{errors.root.message}</div>}
              </div>
              <Button type="submit" disabled={submitButtonDisabled} className="w-full">
                Register
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
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
                Already have an account?{' '}
                <Link href="/login" className="underline underline-offset-4">
                  Login
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
