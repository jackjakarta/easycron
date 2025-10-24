import { IS_DEV_MODE } from '@/utils/dev';

import { createInformationMailTemplate, createUserActionMailTemplate } from './templates';
import { type EmailAction, type EmailActionResult, type InformationEmailMetadata } from './types';
import { mailjetSendEmail, sendTestEmail } from './utils';

export type SendUserActionEmail = typeof sendUserActionEmail;

/**
 * Sends emails to user with a specific user action to be executed by the user
 * via an action link. This function should only be used for sending email where the user receives
 * some kind of proceed link inside the template
 * */
export async function sendUserActionEmail({
  to,
  action,
  actionUrl,
}: {
  to: string;
  action: EmailAction;
  actionUrl: string;
}): Promise<EmailActionResult> {
  const result = await createUserActionMailTemplate({ email: to, action, actionUrl });

  if (result === undefined || !result.success) {
    return {
      success: false,
      error: `Could not generate mail template for action '${action}' and email: '${to}'`,
    };
  }

  const { subject, mailTemplate, textPart } = result;

  try {
    if (IS_DEV_MODE) {
      const testEmailResult = await sendTestEmail({
        to,
        subject,
        html: mailTemplate,
        text: textPart,
      });

      console.info('Email successfully sent:', testEmailResult);
      return { success: true };
    }

    const request = await mailjetSendEmail({
      to,
      subject,
      html: mailTemplate,
      text: textPart,
    });

    if (request.response.status >= 400 && request.response.status <= 599) {
      console.error('Email send returned the following error:', request.response.statusText);
      return {
        success: false,
        error: `Email send returned the following error: ${request.response.statusText}`,
      };
    }

    return { success: true };
  } catch (e: unknown) {
    console.error('Email send returned the following error:', e);

    return {
      success: false,
      error:
        e instanceof Error ? `${e.name}, ${e.message}, ${e.stack}` : 'error could not be parsed',
    };
  }
}

/**
 * Sends information mails to the user about some successful or not successul executed action
 * This email shall not contain any forwarding or proceed actions inside the mail and serves
 * for information purposes only
 * */
export async function sendUserActionInformationEmail({
  to,
  information,
}: {
  to: string;
  information: InformationEmailMetadata;
}) {
  const result = await createInformationMailTemplate(information);

  if (result === undefined || !result.success) {
    console.error(
      `Could not generate mail template for information '${information.type}' and email: '${to}'`,
    );

    return {
      success: false,
      error: 'For more information look inside the logs',
    };
  }

  const { subject, mailTemplate, textPart } = result;

  try {
    if (IS_DEV_MODE) {
      const result = await sendTestEmail({
        to,
        subject,
        html: mailTemplate,
        text: textPart,
      });

      console.info('Email successfully sent:', result);

      return { success: true };
    }

    const request = await mailjetSendEmail({
      to,
      subject,
      html: mailTemplate,
      text: textPart,
    });

    console.info('Email successfully sent:', request.body);

    return { success: true };
  } catch (e: unknown) {
    console.error('Email send returned the following error:', e);

    return {
      success: false,
      error:
        e instanceof Error ? `${e.name}, ${e.message}, ${e.stack}` : 'error could not be parsed',
    };
  }
}
