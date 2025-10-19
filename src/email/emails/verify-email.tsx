import { Button, Section, Text } from '@react-email/components';

import BaseEmailTemplate from './base';

type VerifyEmailProps = {
  actionUrl: string;
  userEmail?: string;
};

export default function VerifyEmailTemplate({ actionUrl, userEmail }: VerifyEmailProps) {
  return (
    <BaseEmailTemplate preview="Verify your email address">
      <Text className="mb-4 text-base leading-6 text-gray-700">
        Hello {userEmail !== undefined && <span className="font-semibold">{userEmail}</span>},
      </Text>
      <Text className="mb-6 text-base leading-6 text-gray-700">
        thank you for signing up! To complete your registration and secure your account, please
        verify your email address using the button below.
      </Text>

      <Text className="mb-6 text-base leading-6 text-gray-700">
        This link will expire in 10 minutes for security purposes.
      </Text>

      <Section className="mb-6 text-center">
        <Button
          href={actionUrl}
          className="rounded-lg bg-gray-900 px-8 py-3 text-base font-medium text-white"
        >
          Verify Email Address
        </Button>
      </Section>

      <Text className="mb-4 text-sm leading-5 text-gray-600">
        If you did not create an account with easyCron, you can safely ignore this email.
      </Text>
    </BaseEmailTemplate>
  );
}

VerifyEmailTemplate.PreviewProps = {
  actionUrl: 'http://127.0.0.1:3000/verify-email',
  userEmail: 'user@example.com',
};
