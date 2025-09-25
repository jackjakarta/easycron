'use client';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { z } from 'zod';

const passwordSchema = z.object({ password: z.string().min(1, 'Password is required') });
const verify2FASchema = z.object({
  code: z.string().min(6, 'Invalid 2FA code').max(6, 'Invalid 2FA code'),
});

type PasswordFormData = z.infer<typeof passwordSchema>;
type Verify2FAFormData = z.infer<typeof verify2FASchema>;

export default function Enable2FAButton() {
  const router = useRouter();

  const [totpURI, setTotpURI] = React.useState<string | null>(null);
  const [backupCodes, setBackupCodes] = React.useState<string[] | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<Verify2FAFormData>({
    resolver: zodResolver(verify2FASchema),
    defaultValues: { code: '' },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { isSubmitting: isPasswordSubmitting },
    watch: watchPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
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
      return;
    }

    setTotpURI(null);
    setBackupCodes(null);
    router.push('/');
  }

  async function onSubmitPassword(passwordData: PasswordFormData) {
    const { password } = passwordData;

    const { data, error } = await authClient.twoFactor.enable({
      password,
      issuer: 'easyCron',
    });

    if (error !== null) {
      console.error(error);
      return;
    }

    setTotpURI(data.totpURI);
    setBackupCodes(data.backupCodes);
  }

  async function downloadBackupCodes() {
    if (backupCodes === null) return;
    const element = document.createElement('a');
    const file = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'backup-codes.txt';
    document.body.appendChild(element);
    element.click();
  }

  const codeValue = watch('code');
  const passwordValue = watchPassword('password');

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {totpURI === null ? (
        <form
          onSubmit={handlePasswordSubmit(onSubmitPassword)}
          className="flex flex-col items-center justify-center gap-4"
        >
          <Label htmlFor="password">Enter your password:</Label>
          <Input
            {...registerPassword('password')}
            id="password"
            type="password"
            placeholder="Enter your password"
          />
          <Button
            type="submit"
            disabled={isPasswordSubmitting || passwordValue.trim().length === 0}
          >
            {isPasswordSubmitting ? 'Enabling...' : 'Enable 2FA'}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center">Scan this QR code with your authenticator app:</p>
          <QRCode value={totpURI} />
          <span>Secret: {extractOtpauthSecret(totpURI)}</span>
          <span>Backup codes:</span>

          {backupCodes !== null && backupCodes.length > 0 && (
            <>
              <ul>
                {backupCodes.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </ul>

              <Button onClick={downloadBackupCodes}>Download Backup Codes</Button>
            </>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Label htmlFor="code">Enter 2FA Code:</Label>
            <Input {...register('code')} id="code" placeholder="Enter 2FA code" />
            <Button type="submit" disabled={isSubmitting || codeValue.trim().length === 0}>
              {isSubmitting ? 'Verifying...' : 'Verify 2FA Code'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function extractOtpauthSecret(otpauthUrl: string): string {
  try {
    const url = new URL(otpauthUrl);

    if (url.protocol !== 'otpauth:') {
      throw new Error(`Expected otpauth protocol, got "${url.protocol}"`);
    }

    const secret = url.searchParams.get('secret');

    if (!secret || !secret.trim()) {
      throw new Error("Missing 'secret' in otpauth URL.");
    }

    return secret.trim();
  } catch (error) {
    console.error('Failed to parse otpauth URL:', error);
    return 'Invalid otpauth URL';
  }
}
