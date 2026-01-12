import Stripe from 'stripe';
import { PaymentProvider, OrderData } from './types';

export class StripeProvider implements PaymentProvider {
  name = 'stripe';
  private stripe: Stripe;

  constructor() {
    // Lazy initialization - only create Stripe instance when needed at runtime
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createSession(order: OrderData): Promise<{ url: string; sessionId: string }> {
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: order.currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to stotinki/cents
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        // CRITICAL: We pass the full order context here to retrieve it in the webhook
        orderId: order.orderId,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        customerAddress: order.customer.address,
        itemsSummary: JSON.stringify(order.items.map(i => `${i.quantity}x ${i.name}`)),
        notes: order.notes || '',
      },
      customer_email: order.customer.email,
    });

    if (!session.url) {
      throw new Error('Failed to create Stripe session URL');
    }

    return { url: session.url, sessionId: session.id };
  }

  async handleWebhook(req: Request): Promise<{
    event: string;
    orderId?: string;
    success: boolean;
    orderData?: OrderData;
  }> {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      throw new Error('Missing stripe-signature header');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw new Error('Webhook signature verification failed');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata!;

      // Reconstruct order data from metadata
      const orderData: OrderData = {
        orderId: metadata.orderId,
        amount: session.amount_total || 0,
        currency: session.currency || 'bgn',
        customer: {
          name: metadata.customerName,
          email: session.customer_email || undefined,
          phone: metadata.customerPhone,
          address: metadata.customerAddress,
        },
        items: JSON.parse(metadata.itemsSummary || '[]').map((item: string) => {
          const match = item.match(/^(\d+)x\s+(.+)$/);
          return {
            id: '',
            name: match ? match[2] : item,
            quantity: match ? parseInt(match[1]) : 1,
            price: 0,
          };
        }),
        notes: metadata.notes || undefined,
      };

      return {
        event: 'payment.succeeded',
        orderId: metadata.orderId,
        success: true,
        orderData,
      };
    }

    return {
      event: event.type,
      success: false,
    };
  }
}
