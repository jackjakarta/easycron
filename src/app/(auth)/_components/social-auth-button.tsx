'use client';

import { authClient } from '@/auth/client';
import { type SocialProvider } from '@/auth/types';
import GithubIcon from '@/components/icons/github';
import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

type SocialLoginButtonProps = {
  provider: SocialProvider;
  onError?: () => void;
} & Omit<React.ComponentProps<typeof Button>, 'type' | 'onClick'>;

export default function SocialAuthButton({ provider, onError, ...props }: SocialLoginButtonProps) {
  const t = useTranslations('auth.login.form.buttons');

  async function handleSocialLogin() {
    const { error } = await authClient.signIn.social({ provider, callbackURL: '/dashboard' });

    if (error !== null) {
      onError?.();
      return;
    }
  }

  return (
    <Button type="button" onClick={handleSocialLogin} {...props}>
      {getIconByLoginProvider(provider)}
      {t('login-with')} {getLoginProviderName(provider)}
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
