import { Heading, Text } from '@react-email/components';

import BaseEmailTemplate from './base';

type InformationTemplateProps = {
  header: string;
  content: string;
};

export default function InformationTemplate({ header, content }: InformationTemplateProps) {
  return (
    <BaseEmailTemplate preview={header}>
      <Heading className="mb-6 text-center text-2xl font-bold text-red-900">{header}</Heading>
      <Text className="mb-4 text-base leading-6 text-gray-700">Hello,</Text>
      <Text className="mb-6 text-base leading-6 text-gray-700">{content}</Text>
    </BaseEmailTemplate>
  );
}

InformationTemplate.PreviewProps = {
  header: 'Information Email',
  content: 'This is an informational email from El Chat.',
};
