import { getUser } from '@/auth/utils';
import { dbGetProjects } from '@/db/functions/project';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();

  try {
    const projects = await dbGetProjects({ userId: user.id });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
