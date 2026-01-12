export interface OrderData {
  orderId: string;
  amount: number; // in cents/stotinki
  currency: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  notes?: string;
  metadata?: Record<string, string>;
}

export interface PaymentProvider {
  name: string;
  createSession(order: OrderData): Promise<{ url: string; sessionId: string }>;
  handleWebhook(request: Request): Promise<{
    event: string;
    orderId?: string;
    success: boolean;
    orderData?: OrderData;
  }>;
}
