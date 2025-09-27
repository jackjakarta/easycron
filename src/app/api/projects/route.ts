import { getUser } from '@/auth/utils';
import { dbGetProjectsAndJobsByUserId } from '@/db/functions/project';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getUser();
    const projects = await dbGetProjectsAndJobsByUserId({ userId: user.id });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
