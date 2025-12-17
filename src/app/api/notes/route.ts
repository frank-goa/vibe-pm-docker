import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const NOTE_ID = 'default-note';

export async function GET() {
  try {
    let note = await prisma.note.findFirst();

    if (!note) {
      note = await prisma.note.create({
        data: {
          id: NOTE_ID,
          content: '',
        },
      });
    }

    return NextResponse.json({ content: note.content });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    let note = await prisma.note.findFirst();

    if (note) {
      note = await prisma.note.update({
        where: { id: note.id },
        data: { content },
      });
    } else {
      note = await prisma.note.create({
        data: {
          id: NOTE_ID,
          content,
        },
      });
    }

    return NextResponse.json({ content: note.content });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}
