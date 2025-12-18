import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        labels: {
          include: {
            label: true,
          },
        },
        subtasks: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      columnId: task.columnId,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString().split('T')[0],
      labels: task.labels.map((tl) => tl.label.id),
      subtasks: task.subtasks.map((s) => ({
        id: s.id,
        text: s.text,
        completed: s.completed,
      })),
      createdAt: task.createdAt.getTime(),
    }));

    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, columnId, priority, dueDate, labels, subtasks } = body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        columnId: columnId || 'todo',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        labels: labels?.length
          ? {
              create: labels.map((labelId: string) => ({
                label: { connect: { id: labelId } },
              })),
            }
          : undefined,
        subtasks: subtasks?.length
          ? {
              create: subtasks.map((s: { text: string; completed?: boolean }) => ({
                text: s.text,
                completed: s.completed || false,
              })),
            }
          : undefined,
      },
      include: {
        labels: {
          include: {
            label: true,
          },
        },
        subtasks: true,
      },
    });

    return NextResponse.json({
      id: task.id,
      title: task.title,
      description: task.description,
      columnId: task.columnId,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString().split('T')[0],
      labels: task.labels.map((tl) => tl.label.id),
      subtasks: task.subtasks.map((s) => ({
        id: s.id,
        text: s.text,
        completed: s.completed,
      })),
      createdAt: task.createdAt.getTime(),
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, columnId, priority, dueDate, labels, subtasks } = body;

    // Delete existing label connections
    await prisma.taskLabel.deleteMany({
      where: { taskId: id },
    });

    // Delete existing subtasks and recreate (simpler than diffing)
    if (subtasks !== undefined) {
      await prisma.subtask.deleteMany({
        where: { taskId: id },
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        columnId,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        labels: labels?.length
          ? {
              create: labels.map((labelId: string) => ({
                label: { connect: { id: labelId } },
              })),
            }
          : undefined,
        subtasks: subtasks?.length
          ? {
              create: subtasks.map((s: { text: string; completed?: boolean }) => ({
                text: s.text,
                completed: s.completed || false,
              })),
            }
          : undefined,
      },
      include: {
        labels: {
          include: {
            label: true,
          },
        },
        subtasks: true,
      },
    });

    return NextResponse.json({
      id: task.id,
      title: task.title,
      description: task.description,
      columnId: task.columnId,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString().split('T')[0],
      labels: task.labels.map((tl) => tl.label.id),
      subtasks: task.subtasks.map((s) => ({
        id: s.id,
        text: s.text,
        completed: s.completed,
      })),
      createdAt: task.createdAt.getTime(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
