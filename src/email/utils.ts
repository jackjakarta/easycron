import nodemailer from 'nodemailer';

import { mailjet } from './client';
import { type EmailActionResult } from './types';

export async function mailjetSendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  return await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'info@sharedocs.app',
          Name: 'PDF Exporter App',
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: subject,
        HTMLPart: html,
        TextPart: text,
      },
    ],
  });
}

export async function sendTestEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<EmailActionResult | undefined> {
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    auth: {
      user: 'jack@gmail.com',
      pass: 'hdsa2gh1uih',
    },
  });

  const mailOptions = {
    from: 'info@codebyalex.dev',
    to,
    subject,
    html,
    text: text ?? 'This is a test email. Please ignore it.',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.info({ info });
    return { success: true };
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
