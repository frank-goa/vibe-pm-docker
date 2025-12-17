import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_LABELS = [
  { id: 'bug', name: 'Bug', color: 'red' },
  { id: 'feature', name: 'Feature', color: 'blue' },
  { id: 'design', name: 'Design', color: 'purple' },
  { id: 'docs', name: 'Docs', color: 'yellow' },
  { id: 'urgent', name: 'Urgent', color: 'orange' },
];

export async function POST() {
  try {
    // Check if labels already exist
    const existingLabels = await prisma.label.findMany();

    if (existingLabels.length === 0) {
      // Create default labels
      await prisma.label.createMany({
        data: DEFAULT_LABELS,
      });
    }

    // Create default note if not exists
    const existingNote = await prisma.note.findFirst();
    if (!existingNote) {
      await prisma.note.create({
        data: {
          id: 'default-note',
          content: '',
        },
      });
    }

    const labels = await prisma.label.findMany();

    return NextResponse.json({
      message: 'Database seeded successfully',
      labels,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
