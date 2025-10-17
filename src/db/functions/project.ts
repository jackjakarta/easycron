import { and, desc, eq, inArray } from 'drizzle-orm';

import { db } from '..';
import {
  executionTable,
  jobTable,
  projectTable,
  secretTable,
  webhookEndpointTable,
  type InsertProjectModel,
  type JobModel,
  type ProjectModel,
  type UpdateProjectModel,
} from '../schema';

export type ProjectWithJobs = ProjectModel & { jobs: JobModel[] };

export async function dbGetProjectById({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}): Promise<ProjectWithJobs | undefined> {
  const rows = await db
    .select()
    .from(projectTable)
    .leftJoin(jobTable, and(eq(jobTable.projectId, projectTable.id), eq(jobTable.userId, userId)))
    .where(and(eq(projectTable.id, projectId), eq(projectTable.userId, userId)));

  if (rows.length === 0) {
    return undefined;
  }

  const projectWithJobs: ProjectWithJobs | undefined = {
    ...rows[0]!.project,
    jobs: rows.map((row) => row.job).filter((job): job is JobModel => job !== null),
  };

  return projectWithJobs;
}

export async function dbGetProjects({ userId }: { userId: string }) {
  const projects = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.userId, userId))
    .orderBy(desc(projectTable.createdAt));

  return projects;
}

export async function dbGetProjectsAndJobsByUserId({
  userId,
}: {
  userId: string;
}): Promise<ProjectWithJobs[]> {
  const rows = await db
    .select()
    .from(projectTable)
    .leftJoin(jobTable, and(eq(jobTable.projectId, projectTable.id), eq(jobTable.userId, userId)))
    .where(eq(projectTable.userId, userId))
    .orderBy(desc(projectTable.updatedAt));

  const projectsMap = new Map<string, ProjectModel & { jobs: JobModel[] }>();

  for (const row of rows) {
    const project = row.project;
    const job = row.job;

    if (!projectsMap.has(project.id)) {
      projectsMap.set(project.id, {
        ...project,
        jobs: [],
      });
    }

    if (job !== null) {
      projectsMap.get(project.id)?.jobs.push(job);
    }
  }

  return Array.from(projectsMap.values());
}

export async function dbInsertProject(data: InsertProjectModel): Promise<ProjectModel | undefined> {
  const [project] = await db.insert(projectTable).values(data).returning();

  return project;
}

export async function dbUpdateProject({
  projectId,
  userId,
  data,
}: {
  projectId: string;
  userId: string;
  data: UpdateProjectModel;
}): Promise<ProjectModel | undefined> {
  const [project] = await db
    .update(projectTable)
    .set(data)
    .where(and(eq(projectTable.id, projectId), eq(projectTable.userId, userId)))
    .returning();

  return project;
}

export async function dbDeleteProject({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}): Promise<ProjectModel | undefined> {
  const deleted = await db.transaction(async (tx) => {
    const projectJobs = await tx
      .select()
      .from(jobTable)
      .where(and(eq(jobTable.projectId, projectId), eq(jobTable.userId, userId)));

    if (projectJobs.length > 0) {
      const jobIds = projectJobs.map((job) => job.id);
      await tx.delete(executionTable).where(inArray(executionTable.jobId, jobIds));

      await tx
        .delete(jobTable)
        .where(and(eq(jobTable.projectId, projectId), eq(jobTable.userId, userId)));
    }

    await tx
      .delete(secretTable)
      .where(and(eq(secretTable.projectId, projectId), eq(secretTable.userId, userId)));

    await tx
      .delete(webhookEndpointTable)
      .where(
        and(eq(webhookEndpointTable.projectId, projectId), eq(webhookEndpointTable.userId, userId)),
      );

    const [deletedProject] = await tx
      .delete(projectTable)
      .where(and(eq(projectTable.id, projectId), eq(projectTable.userId, userId)))
      .returning();

    return deletedProject;
  });

  return deleted;
}
