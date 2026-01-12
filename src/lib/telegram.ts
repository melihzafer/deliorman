import { OrderData } from './payment/types';

interface TelegramOrderNotification {
  order: OrderData;
  type: 'cash' | 'paid';
}

export async function sendOrderNotification({ order, type }: TelegramOrderNotification): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram configuration missing');
    throw new Error('Telegram bot not configured');
  }

  const itemsList = order.items
    .map(item => `- ${item.quantity}x ${item.name}`)
    .join('\n');

  const total = (order.amount / 100).toFixed(2); // Convert from stotinki to leva

  let message: string;

  if (type === 'cash') {
    message = `⚠️ <b>НОВА ПОРЪЧКА С НАЛОЖЕН ПЛАТЕЖ</b> ⚠️
-----------------------------
📞 <b>ОБАДЕТЕ СЕ ЗА ПОТВЪРЖДЕНИЕ:</b> ${order.customer.phone}
-----------------------------
👤 <b>${order.customer.name}</b>
📍 <i>${order.customer.address}</i>

🛒 <b>Поръчка:</b>
${itemsList}

${order.notes ? `📝 <b>Бележка:</b> ${order.notes}\n\n` : ''}💵 <b>Обща сума:</b> ${total} лв.

<b>‼️ ВАЖНО: Обадете се на клиента ПРЕДИ да приготвите поръчката!</b>`;
  } else {
    message = `✅ <b>ПЛАТЕНА ПОРЪЧКА (STRIPE)</b> ✅
-----------------------------
🚀 <b>ЗАПОЧНЕТЕ ПРИГОТВЯНЕТО</b>
-----------------------------
👤 <b>${order.customer.name}</b>
📍 <i>${order.customer.address}</i>
📞 ${order.customer.phone}

🛒 <b>Поръчка:</b>
${itemsList}

${order.notes ? `📝 <b>Бележка:</b> ${order.notes}\n\n` : ''}💳 <b>Платено:</b> ${total} лв.
🆔 <b>Номер на поръчка:</b> ${order.orderId}`;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API error:', error);
      throw new Error('Failed to send Telegram notification');
    }

    console.log('Telegram notification sent successfully');
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
}
