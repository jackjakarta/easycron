import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

import Footer from './_components/footer';
import Header from './_components/header';

export default function BaseEmailTemplate({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Preview>{preview}</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-2xl px-4 py-8">
            <Header />

            <Section className="bg-white px-8 py-6">
              {children}
              <Hr className="my-6 border-gray-200" />
              <Section className="mb-6 rounded-lg bg-gray-50 p-4">
                <Text className="mb-2 text-sm leading-5 font-medium text-gray-800">
                  🔒 Security Notice
                </Text>
                <Text className="text-sm leading-5 text-gray-700">
                  If you did not request this email, please ignore it. For your security, do not
                  share any links or codes contained within. If you have any concerns, please
                  contact our support team.
                </Text>
              </Section>
            </Section>

            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
