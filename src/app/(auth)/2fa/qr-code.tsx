import { authClient } from '@/auth/client';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'react-qr-code';

export default function UserCard({ password }: { password: string }) {
  async function handleEnable2FA() {}

  return <h1>QR Code</h1>;
}
