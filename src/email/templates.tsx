import { dbGetUserByEmail } from '@/db/functions/user';

import ForgotPasswordTemplate from './emails/forgot-password';
import InformationTemplate from './emails/information';
import VerifyEmailTemplate from './emails/verify-email';
import {
  type EmailAction,
  type InformationEmailMetadata,
  type MailTemplateResponse,
} from './types';
import { renderEmailTemplate } from './utils';

export async function createUserActionMailTemplate({
  email,
  action,
  actionUrl,
}: {
  email: string;
  action: EmailAction;
  actionUrl: string;
}): Promise<MailTemplateResponse | undefined> {
  if (action === 'reset-password' && (await dbGetUserByEmail({ email })) === undefined) {
    console.error({ error: `Cannot send email to non-existing user with email '${email}'` });
    return undefined;
  }

  switch (action) {
    case 'verify-email': {
      const { html, text } = await renderEmailTemplate(
        <VerifyEmailTemplate actionUrl={actionUrl} userEmail={email} />,
      );

      return {
        success: true,
        subject: 'Verify your email address',
        mailTemplate: html,
        textPart: text,
      };
    }

    case 'reset-password': {
      const { html, text } = await renderEmailTemplate(
        <ForgotPasswordTemplate actionUrl={actionUrl} userEmail={email} />,
      );

      return {
        success: true,
        subject: 'Reset your password',
        mailTemplate: html,
        textPart: text,
      };
    }

    default:
      return undefined;
  }
}

export async function createInformationMailTemplate(information: InformationEmailMetadata) {
  switch (information.type) {
    case 'email-verified-success':
      return renderInformationTemplate(
        'Email verified',
        'Your email address has been successfully verified. You can now use all features of PDF Editor.',
      );

    case 'reset-password-success':
      return renderInformationTemplate(
        'Password reset successful',
        'Your password has been successfully reset. You can now log in with your new password.',
      );

    case 'account-delete-success':
      return renderInformationTemplate(
        'Account deleted',
        'Your account has been successfully deleted. We are sorry to see you go.',
      );

    case 'subscription-purchased':
      return renderInformationTemplate(
        'Subscription purchased',
        'Thank you for purchasing a subscription. You can now enjoy the benefits of being a pro user.',
      );

    default:
      return undefined;
  }
}

async function renderInformationTemplate(header: string, content: string) {
  const { html, text } = await renderEmailTemplate(
    <InformationTemplate header={header} content={content} />,
  );

  return {
    success: true,
    subject: header,
    mailTemplate: html,
    textPart: text,
  };
}
