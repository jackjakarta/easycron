'use client';

import { authClient } from '@/auth/client';
import { type SocialProvider } from '@/auth/types';
import GithubIcon from '@/components/icons/github';
import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type SocialLoginButtonProps = {
  provider: SocialProvider;
  onError?: () => void;
} & Omit<React.ComponentProps<typeof Button>, 'type' | 'onClick'>;

export default function SocialAuthButton({ provider, onError, ...props }: SocialLoginButtonProps) {
  const router = useRouter();

  async function handleSocialLogin() {
    const { error } = await authClient.signIn.social({ provider });

    if (error !== null) {
      onError?.();
      return;
    }

    router.replace('/');
  }

  return (
    <Button type="button" onClick={handleSocialLogin} {...props}>
      {getIconByLoginProvider(provider)}
      Login with {getLoginProviderName(provider)}
    </Button>
  );
}

function getIconByLoginProvider(provider: SocialProvider, className: string = 'size-4') {
  switch (provider) {
    case 'google':
      return <GoogleIcon className={className} />;
    case 'github':
      return <GithubIcon className={className} />;
    default:
      return null;
  }
}

function getLoginProviderName(provider: SocialProvider) {
  switch (provider) {
    case 'google':
      return 'Google';
    case 'github':
      return 'GitHub';
    default:
      return null;
  }
}
