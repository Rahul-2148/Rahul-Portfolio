import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    // Log securely in server environment
    console.log(`[Contact Message Received] From: ${name} <${email}>`);
    console.log(`Message preview: ${message.slice(0, 100)}...`);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been securely recorded. I will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while processing message.',
      },
      { status: 500 }
    );
  }
}
