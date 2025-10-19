import { Button, Section, Text } from '@react-email/components';

import BaseEmailTemplate from './base';

type ForgotPasswordProps = {
  actionUrl: string;
  userEmail: string;
};

export default function ForgotPasswordTemplate({ actionUrl, userEmail }: ForgotPasswordProps) {
  return (
    <BaseEmailTemplate preview="Reset your password">
      <Text className="mb-4 text-base leading-6 text-gray-700">Hello, {userEmail}</Text>
      <Text className="mb-6 text-base leading-6 text-gray-700">
        We received a request to reset your password. If you did not make this request, you can
        safely ignore this email.
      </Text>
      <Text className="mb-6 text-base leading-6 text-gray-700">
        To reset your password, click the button below. This link will expire in 10 minutes for
        security purposes.
      </Text>
      <Section className="mb-6 text-center">
        <Button
          href={actionUrl}
          className="rounded-lg bg-gray-900 px-8 py-3 text-base font-medium text-white"
        >
          Reset Password
        </Button>
      </Section>
      <Text className="mb-4 text-sm leading-5 text-gray-600">
        If you did not request a password reset, no action is required.
      </Text>
    </BaseEmailTemplate>
  );
}

ForgotPasswordTemplate.PreviewProps = {
  actionUrl: 'http://127.0.0.1:3000/reset-password?token=example-token',
};
