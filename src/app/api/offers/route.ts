import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, offers });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Database error: ' + error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, type, price_basic, price_advanced, price_premium, description, imagePath } = body;
    
    const newOffer = await prisma.offer.create({
      data: {
        title,
        description,
        price: parseFloat(price_basic) || 0,
        imagePath
      }
    });

    return NextResponse.json({ success: true, offer: newOffer });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to create offer: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    await prisma.offer.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to delete offer: ' + error.message }, { status: 500 });
  }
}
