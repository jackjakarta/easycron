'use client';

import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import SectionLabel from '../_components/section-label';
import SettingsItem from '../_components/settings-item';
import Disable2FAButton from './disable-2fa-button';
import Enable2FAButton from './enable-2fa-button';

type AccountSettingsSectionsProps = {
  hasSocialAccount: boolean;
  twoFaEnabled: boolean;
};

export default function AccountSettingsSections({
  hasSocialAccount,
  twoFaEnabled,
}: AccountSettingsSectionsProps) {
  const { theme } = useTheme();
  const twoFaButton = twoFaEnabled ? <Disable2FAButton /> : <Enable2FAButton />;

  return (
    <div className="mt-4 flex flex-col gap-4">
      {!hasSocialAccount && (
        <>
          <SectionLabel>Account Security</SectionLabel>
          <div className="flex flex-col gap-8">
            <SettingsItem
              title="Two-Factor Authentication (2FA)"
              description="Enhance the security of your account by enabling two-factor authentication (2FA)."
              actionComponent={twoFaButton}
            />

            <SettingsItem
              title="Password"
              description="Change your account password regularly to keep your account secure."
              actionComponent={
                <Button variant="outline" className="max-md:w-full" disabled>
                  Change Password
                </Button>
              }
            />
          </div>
          <Separator className="mt-4 mb-2" />
        </>
      )}

      <SectionLabel>Appearance</SectionLabel>
      <div className="flex flex-col gap-8">
        <SettingsItem
          title="Theme"
          description="Switch between light and dark themes to suit your preference."
          actionComponent={
            <ThemeToggle
              trigger={
                <Button variant="outline" className="max-md:w-full">
                  {getCurrentThemeIcon(theme)}
                  {getCurrentThemeName(theme)}
                  <ChevronDown className="ml-2" />
                </Button>
              }
            />
          }
        />
      </div>
      <Separator className="mt-4 mb-2" />
    </div>
  );
}

function getCurrentThemeName(theme: string | undefined) {
  switch (theme) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    case 'system':
      return 'System';
    default:
      return 'System';
  }
}

function getCurrentThemeIcon(theme: string | undefined) {
  const iconClassName = 'size-4';

  switch (theme) {
    case 'light':
      return <Sun className={iconClassName} />;
    case 'dark':
      return <Moon className={iconClassName} />;
    case 'system':
      return <Monitor className={iconClassName} />;
    default:
      return <Monitor className={iconClassName} />;
  }
}
