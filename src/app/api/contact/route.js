import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');

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
    
    if (!phone || phone.trim().length < 9) {
      errors.push({ field: 'phone', message: 'Невалиден телефонен номер' });
    }
    
    if (!message || message.trim().length < 10) {
      errors.push({ field: 'message', message: 'Съобщението трябва да е поне 10 символа' });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailContent = `
Ново съобщение от контактната форма на Ресторант Делиорман

Име: ${firstName} ${lastName}
Имейл: ${email}
Телефон: ${phone}

Съобщение:
${message}

---
Изпратено: ${new Date().toLocaleString('bg-BG')}
    `.trim();

    // Log to console (for now)
    console.log('=== NEW CONTACT FORM SUBMISSION ===');
    console.log(emailContent);
    console.log('===================================');

    // TODO: Integrate with email service (Resend, SendGrid, or SMTP)
    // For now, we'll just log it and return success
    
    // Example with Resend (commented out - requires setup):
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Deliorman Contact <onboarding@resend.dev>',
      to: 'restaurantdeliorman@gmail.com',
      subject: `Ново съобщение от ${firstName} ${lastName}`,
      text: emailContent,
    });
    

    return NextResponse.json({
      success: true,
      message: 'Благодарим за вашето съобщение! Ще се свържем с вас скоро.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        errors: [{ message: 'Възникна грешка при обработката на формата. Моля, опитайте отново.' }]
      },
      { status: 500 }
    );
  }
}
