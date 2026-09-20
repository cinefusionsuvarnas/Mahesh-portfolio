import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
        { transactionId: { contains: search } }
      ]
    } : {};

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { items: true }
    });

    const total = await prisma.order.count({ where });

    // Format response to match legacy app.js expectation
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      transaction_id: order.transactionId,
      total_amount: order.totalAmount,
      created_at: order.createdAt.toISOString(),
      items: order.items.map(item => ({
        name: item.name,
        price: item.price,
        image: item.image
      }))
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to load orders: ' + error.message }, { status: 500 });
  }
}
