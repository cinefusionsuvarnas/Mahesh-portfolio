import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer_name, customer_email, customer_phone, transaction_id, total_amount, items } = body;
    
    if (!items || !items.length) {
      return NextResponse.json({ success: false, message: 'No items in order' }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        customerName: customer_name,
        customerEmail: customer_email,
        customerPhone: customer_phone,
        transactionId: transaction_id,
        totalAmount: parseFloat(total_amount) || 0,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: parseFloat(item.price) || 0,
            image: item.image || ''
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Checkout failed: ' + error.message }, { status: 500 });
  }
}
