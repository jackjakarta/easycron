import { Column, Link, Row, Section, Text } from '@react-email/components';

import { PRIVACY_POLICY_URL, SUPPORT_EMAIL, TERMS_OF_SERVICE_URL } from '../constants';

export default function Footer() {
  return (
    <Section className="rounded-b-lg bg-gray-100 px-8 py-6">
      <Text className="mb-2 text-center text-sm leading-5 text-gray-600">
        This email was sent by PDF Exporter
      </Text>
      <Row className="text-center">
        <Column>
          <Text className="text-xs text-gray-500">
            <Link href={PRIVACY_POLICY_URL} className="mr-4 text-gray-600 hover:underline">
              Privacy Policy
            </Link>
            <Link href={TERMS_OF_SERVICE_URL} className="mr-4 text-gray-600 hover:underline">
              Terms of Service
            </Link>
            <Link href={`mailto:${SUPPORT_EMAIL}`} className="text-gray-600 hover:underline">
              Contact Support
            </Link>
          </Text>
        </Column>
      </Row>
    </Section>
  );
}
