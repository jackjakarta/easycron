import { Button, Section, Text } from '@react-email/components';

import BaseEmailTemplate from './base';

type AcceptInviteProps = {
  actionUrl: string;
  userEmail: string;
  organizationName?: string;
};

export default function AcceptInviteTemplate({
  actionUrl,
  userEmail,
  organizationName,
}: AcceptInviteProps) {
  return (
    <BaseEmailTemplate preview="Accept your invitation to join the organization">
      <Text className="mb-4 text-base leading-6 text-gray-700">Hello, {userEmail}</Text>
      <Text className="mb-6 text-base leading-6 text-gray-700">
        You have been invited to join {organizationName ?? 'the organization'}. To accept the
        invitation, click the button below.
      </Text>
      <Text className="mb-6 text-base leading-6 text-gray-700">
        To accept the invitation, click the button below.
      </Text>
      <Section className="mb-6 text-center">
        <Button
          href={actionUrl}
          className="rounded-lg bg-gray-900 px-8 py-3 text-base font-medium text-white"
        >
          Accept Invitation
        </Button>
      </Section>
      <Text className="mb-4 text-sm leading-5 text-gray-600">
        If you did not request this invitation, no action is required.
      </Text>
    </BaseEmailTemplate>
  );
}

AcceptInviteTemplate.PreviewProps = {
  actionUrl: 'http://127.0.0.1:3000/accept-invitation?token=example-token',
};
