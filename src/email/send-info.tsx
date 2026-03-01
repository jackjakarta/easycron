import { db } from '@/db';
import { userTable } from '@/db/schema';
import React from 'react';

import InformationTemplate from './emails/information';
import { renderEmailTemplate, sendTestEmail } from './utils';

const MAINTENANCE_NOTICE = `Dear easyCron users,

We hope this message finds you well. We wanted to inform you about an upcoming maintenance window for our services. On [Date] from [Start Time] to [End Time], we will be performing essential updates and improvements to enhance your experience with easyCron.

During this maintenance period, our services may be temporarily unavailable. We apologize for any inconvenience this may cause and appreciate your understanding as we work to provide you with a better and more reliable service.

If you have any questions or concerns, please do not hesitate to reach out to our support team at @easycron_support.

Thank you for being a valued member of the easyCron community.

Best regards,
The easyCron Team`;

async function sendInfoEmail() {
  const users = await db.select().from(userTable).limit(20);

  if (users.length === 0) {
    console.warn('No users found. Skipping email sending.');
    return;
  }

  const { html, text } = await renderEmailTemplate(
    <InformationTemplate header="Important Information" content={MAINTENANCE_NOTICE} />,
  );

  for (const user of users) {
    try {
      // await mailjetSendEmail({
      //   to: user.email,
      //   subject: 'Important Information from easyCron',
      //   html,
      //   text,
      // });

      await sendTestEmail({
        to: user.email,
        subject: 'Important Information from easyCron',
        html,
        text,
      });
    } catch (error) {
      console.error(`Failed to send email to ${user.email}:`, error);
    }
  }
}

sendInfoEmail()
  .then(() => {
    console.info('Email sending process completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('An error occurred during the email sending process:', error);
    process.exit(1);
  });
