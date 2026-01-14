import { NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payment';
import { sendOrderNotification } from '@/lib/telegram';
import { getGoogleSheetsService } from '@/lib/google-sheets';

export async function POST(request: Request) {
  try {
    const provider = getPaymentProvider();

    // Handle the webhook and extract order data
    const result = await provider.handleWebhook(request);

    if (!result.success) {
      return NextResponse.json(
        { received: true, message: 'Event not handled' },
        { status: 200 }
      );
    }

    // If payment succeeded, send Telegram notification
    if (result.event === 'payment.succeeded' && result.orderData) {
      await sendOrderNotification({
        order: result.orderData,
        type: 'paid',
      });

      // Save to Google Sheets (if configured)
      const sheetsService = getGoogleSheetsService();
      if (sheetsService) {
        await sheetsService.appendOrder(result.orderData, 'card');
      }

      console.log(`Order ${result.orderId} notification sent to Telegram`);
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error('Webhook error:', error);

    // Return 400 for webhook signature errors
    if (error instanceof Error && error.message.includes('signature')) {
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
