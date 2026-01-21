/* eslint-disable react/no-unescaped-entities */

import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyList,
  TypographyP,
} from '@/components/ui/typography';

export default function Page() {
  return (
    <>
      <div className="border-border mb-8 border-b pb-8">
        <TypographyH1>Privacy Policy</TypographyH1>
        <TypographyP>Last updated: October 14, 2025</TypographyP>
      </div>

      <div className="text-foreground space-y-8">
        <TypographyP>
          This Privacy Policy describes how <strong>Easy Services GmbH</strong> ("
          <strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>") collects, uses,
          and protects personal data when you use our web application ("
          <strong>the Service</strong>"). Our Service allows users to schedule and manage automated
          HTTP requests ("cron jobs").
        </TypographyP>

        <section>
          <TypographyH2>1. Who We Are</TypographyH2>
          <div className="mt-4 space-y-2">
            <TypographyP>Easy Services GmbH</TypographyP>
            <TypographyP>Registered in Germany</TypographyP>
            <TypographyP>Address: [Insert company address]</TypographyP>
            <TypographyP>
              Email:{' '}
              <a
                href="mailto:privacy@easyservices.io"
                className="text-primary underline-offset-4 hover:underline"
              >
                privacy@easyservices.io
              </a>
            </TypographyP>
          </div>
          <TypographyP>
            We are the data controller responsible for the processing of your personal data within
            the meaning of the EU General Data Protection Regulation (GDPR).
          </TypographyP>
        </section>

        <section>
          <TypographyH2>2. Data We Collect</TypographyH2>
          <TypographyP>We collect and process the following types of information:</TypographyP>

          <div className="mt-6 space-y-6">
            <div>
              <TypographyH3>2.1. Account Information</TypographyH3>
              <TypographyList>
                <li>Name (from your OAuth provider)</li>
                <li>Email address</li>
                <li>Authentication provider identifiers (Google or GitHub)</li>
                <li>Subscription and billing details (via Stripe)</li>
              </TypographyList>
            </div>

            <div>
              <TypographyH3>2.2. Usage Data</TypographyH3>
              <TypographyList>
                <li>
                  Actions performed within the Service (e.g., job creation, editing, or deletion)
                </li>
                <li>Metadata about your cron jobs (schedule times, target URLs, headers, etc.)</li>
                <li>Logs related to job execution (status, success/failure, timestamps)</li>
                <li>
                  IP address, browser type, and device information (for security and analytics)
                </li>
              </TypographyList>
            </div>

            <div>
              <TypographyH3>2.3. Payment Information</TypographyH3>
              <TypographyP>
                All payment processing is handled securely by <strong>Stripe</strong>. We do not
                store or process your credit card information. Stripe's privacy policy applies:{' '}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  https://stripe.com/privacy
                </a>
                .
              </TypographyP>
            </div>

            <div>
              <TypographyH3>2.4. Storage Data</TypographyH3>
              <TypographyP>
                If you upload or store files as part of your jobs or configurations, these are
                stored in <strong>Supabase Storage (S3-compatible)</strong>, hosted within the EU.
              </TypographyP>
            </div>
          </div>
        </section>

        <section>
          <TypographyH2>3. How We Use Your Data</TypographyH2>
          <TypographyP>We use your data to:</TypographyP>
          <TypographyList>
            <li>Provide and maintain the Service</li>
            <li>Manage user accounts and authentication</li>
            <li>Execute and log cron jobs you configure</li>
            <li>Handle billing and subscription management</li>
            <li>Communicate with you about updates, support, or policy changes</li>
            <li>Improve system stability, performance, and security</li>
            <li>Comply with legal obligations</li>
          </TypographyList>
          <TypographyP>
            We <strong>do not sell</strong>, rent, or share your personal data with third parties
            for advertising or marketing purposes.
          </TypographyP>
        </section>

        <section>
          <TypographyH2>4. Legal Bases for Processing</TypographyH2>
          <TypographyP>We process your data based on:</TypographyP>
          <TypographyList>
            <li>
              <strong>Contractual necessity</strong> (Art. 6(1)(b) GDPR): to provide the Service you
              signed up for.
            </li>
            <li>
              <strong>Legal obligation</strong> (Art. 6(1)(c) GDPR): for tax and accounting
              purposes.
            </li>
            <li>
              <strong>Legitimate interests</strong> (Art. 6(1)(f) GDPR): improving security,
              performance, and user experience.
            </li>
            <li>
              <strong>Consent</strong> (Art. 6(1)(a) GDPR): where explicitly granted, e.g., for
              marketing communication.
            </li>
          </TypographyList>
        </section>

        <section>
          <TypographyH2>5. Data Retention</TypographyH2>
          <TypographyP>We retain your personal data:</TypographyP>
          <TypographyList className="text-foreground mt-4 space-y-2">
            <li>As long as your account is active.</li>
            <li>
              For a reasonable period thereafter, as required by law (e.g., billing records for 10
              years under German law).
            </li>
          </TypographyList>
          <TypographyP>
            You may request deletion of your account and associated data at any time (see Section
            9).
          </TypographyP>
        </section>

        <section>
          <TypographyH2>6. Data Sharing and Transfers</TypographyH2>
          <TypographyP>We use the following trusted service providers (processors):</TypographyP>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-foreground px-4 py-3 text-left font-semibold">Service</th>
                  <th className="text-foreground px-4 py-3 text-left font-semibold">Purpose</th>
                  <th className="text-foreground px-4 py-3 text-left font-semibold">
                    Location / Data Center
                  </th>
                  <th className="text-foreground px-4 py-3 text-left font-semibold">
                    Privacy Policy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                <tr>
                  <td className="px-4 py-3 font-medium">Supabase</td>
                  <td className="px-4 py-3">Database, authentication, storage</td>
                  <td className="px-4 py-3">EU (Germany/Ireland)</td>
                  <td className="px-4 py-3">
                    <a
                      href="https://supabase.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Link
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Hetzner Cloud</td>
                  <td className="px-4 py-3">Application hosting</td>
                  <td className="px-4 py-3">Germany</td>
                  <td className="px-4 py-3">
                    <a
                      href="https://www.hetzner.com/legal/privacy-policy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Link
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Stripe</td>
                  <td className="px-4 py-3">Payment processing</td>
                  <td className="px-4 py-3">EU / US (with SCCs)</td>
                  <td className="px-4 py-3">
                    <a
                      href="https://stripe.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Link
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">AWS (Route 53)</td>
                  <td className="px-4 py-3">DNS and domain management</td>
                  <td className="px-4 py-3">EU / US</td>
                  <td className="px-4 py-3">
                    <a
                      href="https://aws.amazon.com/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Link
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Better Auth</td>
                  <td className="px-4 py-3">OAuth authentication middleware</td>
                  <td className="px-4 py-3">EU / US (depending on provider)</td>
                  <td className="px-4 py-3">
                    <a
                      href="https://betterauth.dev/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Link
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Google & GitHub</td>
                  <td className="px-4 py-3">OAuth identity providers</td>
                  <td className="px-4 py-3">Global</td>
                  <td className="px-4 py-3">
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Google
                    </a>
                    {' / '}
                    <a
                      href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      GitHub
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <TypographyP>
            All third-party services are bound by data processing agreements (DPAs) and comply with
            GDPR and, where applicable, EU Standard Contractual Clauses (SCCs).
          </TypographyP>
        </section>

        <section>
          <TypographyH2>7. International Data Transfers</TypographyH2>
          <TypographyP>
            Data may be transferred to or processed in countries outside the European Union,
            particularly when using global service providers (e.g., Stripe, Google). Such transfers
            are safeguarded through:
          </TypographyP>
          <TypographyList className="text-foreground mt-4 space-y-2">
            <li>EU Commission adequacy decisions, or</li>
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission.</li>
          </TypographyList>
        </section>

        <section>
          <TypographyH2>8. Security</TypographyH2>
          <TypographyP>
            We take appropriate technical and organizational measures to protect your data,
            including:
          </TypographyP>
          <TypographyList className="text-foreground mt-4 space-y-2">
            <li>HTTPS/TLS encryption in transit</li>
            <li>Access controls and API key protections</li>
            <li>Encrypted storage on Supabase and Hetzner</li>
            <li>Regular backups and security monitoring</li>
          </TypographyList>
          <TypographyP>
            However, no online system is 100% secure, and we cannot guarantee absolute protection.
          </TypographyP>
        </section>

        <section>
          <TypographyH2>9. Your Rights (GDPR)</TypographyH2>
          <TypographyP>You have the following rights under the GDPR:</TypographyP>
          <TypographyList className="text-foreground mt-4 space-y-2">
            <li>
              <strong>Access</strong>: Request a copy of your personal data.
            </li>
            <li>
              <strong>Rectification</strong>: Correct inaccurate or incomplete data.
            </li>
            <li>
              <strong>Erasure</strong>: Request deletion of your data ("right to be forgotten").
            </li>
            <li>
              <strong>Restriction</strong>: Limit how we process your data.
            </li>
            <li>
              <strong>Portability</strong>: Receive your data in a machine-readable format.
            </li>
            <li>
              <strong>Objection</strong>: Object to processing under certain circumstances.
            </li>
          </TypographyList>
          <TypographyP>
            To exercise these rights, contact us at{' '}
            <a
              href="mailto:privacy@easyservices.io"
              className="text-primary underline-offset-4 hover:underline"
            >
              privacy@easyservices.io
            </a>
            . We will respond within the legally required timeframe.
          </TypographyP>
        </section>

        <section>
          <TypographyH2>10. Cookies and Tracking</TypographyH2>
          <TypographyP>
            We use essential cookies for authentication and session management. We do{' '}
            <strong>not</strong> use third-party advertising or tracking cookies. Optional analytics
            (if enabled) will be anonymized and compliant with GDPR.
          </TypographyP>
        </section>

        <section>
          <TypographyH2>11. Children's Privacy</TypographyH2>
          <TypographyP>
            Our Service is not intended for individuals under 16 years of age. We do not knowingly
            collect personal data from children.
          </TypographyP>
        </section>

        <section>
          <TypographyH2>12. Changes to This Policy</TypographyH2>
          <TypographyP>
            We may update this Privacy Policy occasionally. The latest version will always be
            available at this page. Significant changes will be communicated via email or in-app
            notification.
          </TypographyP>
        </section>

        <section>
          <TypographyH2>13. Contact</TypographyH2>
          <TypographyP>
            If you have questions or concerns about this Privacy Policy or your data, please
            contact:
          </TypographyP>
          <div className="mt-4 space-y-2">
            <TypographyP>Easy Services GmbH</TypographyP>
            <TypographyP>
              Email:{' '}
              <a
                href="mailto:privacy@easyservices.io"
                className="text-primary underline-offset-4 hover:underline"
              >
                privacy@easyservices.io
              </a>
            </TypographyP>
            <TypographyP>Address: [Insert business address]</TypographyP>
          </div>
        </section>
      </div>
    </>
  );
}
