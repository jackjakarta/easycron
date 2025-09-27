import { Column, Img, Row, Section } from '@react-email/components';

import { LOGO_PNG_URL } from '../constants';

export default function Header() {
  return (
    <Section className="rounded-t-lg bg-white px-8 py-6">
      <Row>
        <Column>
          <Img src={LOGO_PNG_URL} width="40" height="40" alt="PDF Exporter" className="mx-auto" />
        </Column>
      </Row>
    </Section>
  );
}
