import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const email = formData.get('email');
    const person = formData.get('person');
    const date = formData.get('date');
    const time = formData.get('time');
    const message = formData.get('message') || 'Няма допълнително съобщение';

    // Validation
    const errors = [];
    
    if (!firstName || firstName.trim().length < 2) {
      errors.push({ field: 'first_name', message: 'Името трябва да е поне 2 символа' });
    }
    
    if (!lastName || lastName.trim().length < 2) {
      errors.push({ field: 'last_name', message: 'Фамилията трябва да е поне 2 символа' });
    }
    
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.push({ field: 'email', message: 'Невалиден имейл адрес' });
    }
    
    if (!person || person === 'Брой гости') {
      errors.push({ field: 'person', message: 'Моля изберете брой гости' });
    }
    
    if (!date) {
      errors.push({ field: 'date', message: 'Моля изберете дата' });
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.push({ field: 'date', message: 'Не може да резервирате за минала дата' });
      }
    }
    
    if (!time || time === 'Час') {
      errors.push({ field: 'time', message: 'Моля изберете час' });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailContent = `
Нова резервация от Ресторант Делиорман

=== ДЕТАЙЛИ ЗА РЕЗЕРВАЦИЯТА ===

Име: ${firstName} ${lastName}
Имейл: ${email}
Брой гости: ${person}
Дата: ${new Date(date).toLocaleDateString('bg-BG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Час: ${time}

Допълнително съобщение:
${message}

---
Изпратено: ${new Date().toLocaleString('bg-BG')}

ВАЖНО: Моля потвърдете резервацията при клиента!
    `.trim();

    // Log to console (for now)
    console.log('=== NEW RESERVATION ===');
    console.log(emailContent);
    console.log('=======================');

    // TODO: Integrate with email service (Resend, SendGrid, or SMTP)
    // For now, we'll just log it and return success
    
    // Example with Resend (commented out - requires setup):
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Deliorman Reservations <onboarding@resend.dev>',
      to: 'restaurantdeliorman@gmail.com',
      subject: `Нова резервация за ${date} в ${time}`,
      text: emailContent,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Благодарим за вашата резервация! Ще получите потвърждение скоро.'
    });

  } catch (error) {
    console.error('Reservation form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        errors: [{ message: 'Възникна грешка при обработката на резервацията. Моля, опитайте отново или се обадете на +359 89 4766273.' }]
      },
      { status: 500 }
    );
  }
}
