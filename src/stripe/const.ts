import Stripe from 'stripe';

export const PAYMENT_METHOD_TYPES = ['card'] satisfies Stripe.Emptyable<
  Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType[]
>;

export const NUMBER_OF_TRIAL_DAYS = 14;
export const MONTHLY_PRICE_ID = 'price_1RUDFt4QRIddAsU2H5DEsVsSYB';
export const YEARLY_PRICE_ID = 'price_1RUDGi4QRIAsUddd2H5Caso4uEx';
