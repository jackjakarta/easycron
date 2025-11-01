export type InformationEmailMetadata =
  | {
      type: 'email-verified-success';
    }
  | {
      type: 'reset-password-success';
    }
  | {
      type: 'account-delete-success';
    }
  | {
      type: 'subscription-purchased';
    }
  | {
      type: 'subscription-canceled';
    }
  | {
      type: 'trial-expired';
    }
  | {
      type: 'trial-ended';
    };

export type MailTemplateResult = {
  success: true;
  subject: string;
  mailTemplate: string;
  textPart: string;
};

export type MailTemplateError = {
  success: false;
  error: string;
};

export type MailTemplateResponse = MailTemplateResult | MailTemplateError;

export type EmailActionResult = {
  success: boolean;
  messageId?: string;
  error?: string;
  createdAt?: Date;
};

export type InformationEmailType = InformationEmailMetadata['type'];

export type EmailAction = 'verify-email' | 'reset-password' | 'organization-invite';
