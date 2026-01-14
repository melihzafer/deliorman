import { NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validations/checkout';
import { getPaymentProvider } from '@/lib/payment';
import { sendOrderNotification } from '@/lib/telegram';
import { getGoogleSheetsService } from '@/lib/google-sheets';
import { OrderData } from '@/lib/payment/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = checkoutSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        },
        { status: 400 }
      );
    }

    const { customerName, phone, address, notes, paymentMethod, items } = validationResult.data;

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate total amount
    const amount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Build order data
    const orderData: OrderData = {
      orderId,
      amount: Math.round(amount * 100), // Convert to stotinki
      currency: 'bgn',
      customer: {
        name: customerName,
        phone,
        address,
      },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      notes,
    };

    // Branch logic based on payment method
    if (paymentMethod === 'cash') {
      // Cash on Delivery - Send Telegram notification immediately
      await sendOrderNotification({
        order: orderData,
        type: 'cash',
      });

      // Save to Google Sheets (if configured)
      const sheetsService = getGoogleSheetsService();
      if (sheetsService) {
        await sheetsService.appendOrder(orderData, 'cash');
      }

      return NextResponse.json({
        success: true,
        orderId,
        message: 'Поръчката е приета! Ще се свържем с вас скоро за потвърждение.',
      });
    } else {
      // Card Payment - Create Stripe session
      const provider = getPaymentProvider();

      const { url, sessionId } = await provider.createSession(orderData);

      return NextResponse.json({
        success: true,
        orderId,
        redirectUrl: url,
        sessionId,
      });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        success: false,
        errors: [{ message: 'Възникна грешка при обработката на поръчката. Моля, опитайте отново.' }],
      },
      { status: 500 }
    );
  }
}
