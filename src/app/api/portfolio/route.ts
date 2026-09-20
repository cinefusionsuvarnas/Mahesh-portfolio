import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, portfolio });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Database error: ' + error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, imagePath, category } = body;
    
    const newItem = await prisma.portfolio.create({
      data: {
        title,
        description,
        imagePath,
        category: category || 'GENERAL'
      }
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to create portfolio item: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    await prisma.portfolio.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to delete portfolio item: ' + error.message }, { status: 500 });
  }
}
