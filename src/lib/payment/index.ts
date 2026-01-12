import { StripeProvider } from './stripe';
// import { RevolutProvider } from './revolut'; // Future implementation

export function getPaymentProvider() {
  // Logic to switch providers via ENV or Flags
  const provider = process.env.PAYMENT_PROVIDER || 'stripe';

  if (provider === 'revolut') {
    // return new RevolutProvider();
    throw new Error('Revolut provider not yet implemented');
  }

  return new StripeProvider();
}
