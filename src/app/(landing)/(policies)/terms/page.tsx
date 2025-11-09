import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyList,
  TypographyP,
} from '@/components/ui/typography';

export default function Page() {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="border-border mb-8 border-b pb-8">
            <TypographyH1>Terms of Service</TypographyH1>
            <TypographyP>Last updated: October 14, 2025</TypographyP>
          </div>

          <div className="text-foreground space-y-8">
            <TypographyP>
              These Terms of Service (&quot;<strong>Terms</strong>&quot;) govern your access to and
              use of the web application and related services (the &quot;<strong>Service</strong>
              &quot;) operated by <strong>Easy Services GmbH</strong> (&quot;<strong>we</strong>
              &quot;, &quot;
              <strong>us</strong>&quot;, or &quot;<strong>our</strong>&quot;). By using the Service,
              you agree to these Terms.
            </TypographyP>
            <TypographyP>If you do not agree, do not use the Service.</TypographyP>

            <section>
              <TypographyH2>1. About Us</TypographyH2>
              <div className="mt-4 space-y-2">
                <TypographyP>Easy Services GmbH</TypographyP>
                <TypographyP>Registered in Germany</TypographyP>
                <TypographyP>
                  Email:{' '}
                  <a
                    href="mailto:support@easyservices.io"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    support@easyservices.io
                  </a>
                </TypographyP>
                <TypographyP>Address: [Insert company address]</TypographyP>
              </div>
            </section>

            <section>
              <TypographyH2>2. Eligibility</TypographyH2>
              <TypographyP>You must:</TypographyP>
              <TypographyList className="text-foreground mt-4 space-y-2">
                <li>
                  Be at least 18 years old (or the age of legal majority in your jurisdiction),
                </li>
                <li>Have the legal capacity to enter into contracts,</li>
                <li>Use the Service for lawful purposes only.</li>
              </TypographyList>
              <TypographyP>
                We currently provide services <strong>to individual users (B2C)</strong>.
                Organization-level (B2B) use is not yet supported.
              </TypographyP>
            </section>

            <section>
              <TypographyH2>3. Description of the Service</TypographyH2>
              <TypographyP>Our Service allows users to:</TypographyP>
              <TypographyList className="text-foreground mt-4 space-y-2">
                <li>Schedule and manage automated HTTP requests (&quot;cron jobs&quot;),</li>
                <li>Configure job timing, payloads, headers, and endpoints,</li>
                <li>View logs and execution results.</li>
              </TypographyList>
              <TypographyP>We may add, modify, or remove features at any time.</TypographyP>
            </section>

            <section>
              <TypographyH2>4. Accounts and Authentication</TypographyH2>
              <TypographyP>
                To use the Service, you must create an account via <strong>Google OAuth</strong> or{' '}
                <strong>GitHub OAuth</strong> through <strong>Better Auth</strong>. You agree to:
              </TypographyP>
              <TypographyList className="text-foreground mt-4 space-y-2">
                <li>Provide accurate and current information,</li>
                <li>Maintain the security of your account credentials,</li>
                <li>Notify us immediately of unauthorized access or use.</li>
              </TypographyList>
              <TypographyP>You are responsible for all activity under your account.</TypographyP>
            </section>

            <section>
              <TypographyH2>5. Subscriptions and Billing</TypographyH2>
              <TypographyP>
                The Service operates on a <strong>subscription basis</strong>, billed monthly or
                yearly via <strong>Stripe</strong>.
              </TypographyP>

              <div className="mt-6 space-y-6">
                <div>
                  <TypographyH3>5.1. Payments</TypographyH3>
                  <TypographyList className="text-foreground mt-4 space-y-2">
                    <li>Subscription fees are charged in advance.</li>
                    <li>
                      All payments are handled by <strong>Stripe</strong>, our payment processor.
                    </li>
                    <li>We do not store your payment information.</li>
                  </TypographyList>
                </div>

                <div>
                  <TypographyH3>5.2. Renewal</TypographyH3>
                  <TypographyP>
                    Subscriptions automatically renew unless cancelled before the renewal date.
                  </TypographyP>
                </div>

                <div>
                  <TypographyH3>5.3. Cancellation</TypographyH3>
                  <TypographyP>
                    You can cancel anytime via your account dashboard. Access will continue until
                    the end of the current billing period. No partial refunds are provided for
                    unused time.
                  </TypographyP>
                </div>

                <div>
                  <TypographyH3>5.4. Changes to Pricing</TypographyH3>
                  <TypographyP>
                    We may update prices with reasonable advance notice. If you continue using the
                    Service after changes take effect, you accept the new pricing.
                  </TypographyP>
                </div>
              </div>
            </section>

            <section>
              <TypographyH2>6. Acceptable Use Policy</TypographyH2>
              <TypographyP>
                You agree <strong>not</strong> to use the Service to:
              </TypographyP>
              <TypographyList className="text-foreground mt-4 space-y-2">
                <li>Violate any applicable law or regulation,</li>
                <li>Attack, overload, or disrupt other systems or networks,</li>
                <li>Execute requests containing malicious, abusive, or illegal content,</li>
                <li>Access third-party systems without authorization,</li>
                <li>Send spam or conduct scraping activities,</li>
                <li>Circumvent rate limits or security features.</li>
              </TypographyList>
              <TypographyP>
                We reserve the right to suspend or terminate your account if you violate this
                policy.
              </TypographyP>
            </section>

            <section>
              <TypographyH2>7. Data Processing and Privacy</TypographyH2>
              <TypographyP>
                Your personal data is processed in accordance with our{' '}
                <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
                .
              </TypographyP>
              <TypographyP>
                You retain ownership of the content and configurations you create. By using the
                Service, you grant us a limited license to process, store, and transmit your data as
                necessary to operate the Service.
              </TypographyP>
            </section>

            <section>
              <TypographyH2>8. Service Availability</TypographyH2>
              <TypographyP>
                We strive to maintain a high level of uptime and reliability. However:
              </TypographyP>
              <TypographyList className="text-foreground mt-4 space-y-2">
                <li>
                  The Service may be temporarily unavailable for maintenance, updates, or due to
                  unforeseen issues.
                </li>
                <li>
                  We provide the Service on an <strong>&quot;as is&quot;</strong> and{' '}
                  <strong>&quot;as available&quot;</strong> basis.
                </li>
                <li>We do not guarantee uninterrupted or error-free operation.</li>
              </TypographyList>
            </section>

            <section>
              <TypographyH2>9. Intellectual Property</TypographyH2>
              <TypographyP>
                All rights, titles, and interests in the Service, including software, design, and
                branding, are owned by <strong>Easy Services GmbH</strong> or its licensors. You may
                not copy, modify, distribute, or reverse-engineer any part of the Service.
              </TypographyP>
            </section>

            <section>
              <TypographyH2>10. Termination</TypographyH2>
              <TypographyP>We may suspend or terminate your account:</TypographyP>
              <TypographyList className="text-foreground mt-4 space-y-2">
                <li>For violation of these Terms,</li>
                <li>For non-payment,</li>
                <li>For security or legal reasons.</li>
              </TypographyList>
              <TypographyP>Upon termination:</TypographyP>
              <TypographyList className="text-foreground mt-4 space-y-2">
                <li>Your access to the Service is revoked,</li>
                <li>Your cron jobs and stored data may be deleted after a grace period.</li>
              </TypographyList>
              <TypographyP>
                You may export your data before termination, where technically possible.
              </TypographyP>
            </section>

            <section>
              <TypographyH2>11. Limitation of Liability</TypographyH2>
              <TypographyP>To the fullest extent permitted by law:</TypographyP>
              <TypographyList className="text-foreground mt-4 space-y-2">
                <li>
                  We are <strong>not liable</strong> for indirect, incidental, or consequential
                  damages, including lost profits, data loss, or downtime.
                </li>
                <li>
                  Our total liability for any claim related to the Service is limited to the amount
                  paid by you in the <strong>past 12 months</strong>.
                </li>
              </TypographyList>
              <TypographyP>
                Nothing in these Terms excludes liability for intentional misconduct or gross
                negligence.
              </TypographyP>
            </section>

            <section>
              <TypographyH2>12. Indemnification</TypographyH2>
              <TypographyP>
                You agree to indemnify and hold harmless <strong>Easy Services GmbH</strong> and its
                employees from any claims, damages, or expenses arising from:
              </TypographyP>
              <TypographyList className="text-foreground mt-4 space-y-2">
                <li>Your misuse of the Service,</li>
                <li>Your breach of these Terms,</li>
                <li>Any cron jobs or requests initiated through your account.</li>
              </TypographyList>
            </section>

            <section>
              <TypographyH2>13. Changes to the Service or Terms</TypographyH2>
              <TypographyP>
                We may update these Terms or modify the Service at any time. If changes are
                material, we will notify you in advance via email or in-app notice. Continued use
                after the effective date constitutes acceptance of the updated Terms.
              </TypographyP>
            </section>

            <section>
              <TypographyH2>14. Governing Law and Jurisdiction</TypographyH2>
              <TypographyP>
                These Terms are governed by <strong>German law</strong>, excluding conflict-of-law
                provisions. The place of jurisdiction is <strong>Berlin, Germany</strong>, unless
                otherwise required by consumer protection law.
              </TypographyP>
            </section>

            <section>
              <TypographyH2>15. Contact</TypographyH2>
              <TypographyP>If you have questions about these Terms, please contact:</TypographyP>
              <div className="mt-4 space-y-2">
                <TypographyP>Easy Services GmbH</TypographyP>
                <TypographyP>
                  Email:{' '}
                  <a
                    href="mailto:support@easyservices.io"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    support@easyservices.io
                  </a>
                </TypographyP>
                <TypographyP>Address: [Insert company address]</TypographyP>
              </div>
            </section>

            <section>
              <TypographyH2>16. Severability</TypographyH2>
              <TypographyP>
                If any provision of these Terms is held invalid or unenforceable, the remaining
                provisions remain in full effect.
              </TypographyP>
            </section>

            <section>
              <TypographyH2>17. Entire Agreement</TypographyH2>
              <TypographyP>
                These Terms, together with our{' '}
                <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
                , constitute the entire agreement between you and{' '}
                <strong>Easy Services GmbH</strong> regarding your use of the Service.
              </TypographyP>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
