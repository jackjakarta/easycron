import { and, desc, eq, inArray, sql } from 'drizzle-orm';

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
  organizationId,
}: {
  projectId: string;
  organizationId: string;
}): Promise<ProjectWithJobs | undefined> {
  const rows = await db
    .select()
    .from(projectTable)
    .leftJoin(
      jobTable,
      and(eq(jobTable.projectId, projectTable.id), eq(jobTable.organizationId, organizationId)),
    )
    .where(and(eq(projectTable.id, projectId), eq(projectTable.organizationId, organizationId)));

  if (rows.length === 0) {
    return undefined;
  }

  const projectWithJobs: ProjectWithJobs | undefined = {
    ...rows[0]!.project,
    jobs: rows.map((row) => row.job).filter((job): job is JobModel => job !== null),
  };

  return projectWithJobs;
}

export async function dbGetProjects({ organizationId }: { organizationId: string }) {
  const projects = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.organizationId, organizationId))
    .orderBy(desc(projectTable.createdAt));

  return projects;
}

export async function dbGetProjectsAndJobsByOrganizationId({
  organizationId,
}: {
  organizationId: string;
}): Promise<ProjectWithJobs[]> {
  const rows = await db
    .select()
    .from(projectTable)
    .leftJoin(
      jobTable,
      and(eq(jobTable.projectId, projectTable.id), eq(jobTable.organizationId, organizationId)),
    )
    .where(eq(projectTable.organizationId, organizationId))
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
  organizationId,
  data,
}: {
  projectId: string;
  organizationId: string;
  data: UpdateProjectModel;
}): Promise<ProjectModel | undefined> {
  const [project] = await db
    .update(projectTable)
    .set(data)
    .where(and(eq(projectTable.id, projectId), eq(projectTable.organizationId, organizationId)))
    .returning();

  return project;
}

export async function dbDeleteProject({
  projectId,
  organizationId,
}: {
  projectId: string;
  organizationId: string;
}): Promise<ProjectModel | undefined> {
  const deleted = await db.transaction(async (tx) => {
    const projectJobs = await tx
      .select()
      .from(jobTable)
      .where(and(eq(jobTable.projectId, projectId), eq(jobTable.organizationId, organizationId)));

    if (projectJobs.length > 0) {
      const jobIds = projectJobs.map((job) => job.id);
      await tx.delete(executionTable).where(inArray(executionTable.jobId, jobIds));

      await tx
        .delete(jobTable)
        .where(and(eq(jobTable.projectId, projectId), eq(jobTable.organizationId, organizationId)));
    }

    await tx
      .delete(secretTable)
      .where(
        and(eq(secretTable.projectId, projectId), eq(secretTable.organizationId, organizationId)),
      );

    await tx
      .delete(webhookEndpointTable)
      .where(
        and(
          eq(webhookEndpointTable.projectId, projectId),
          eq(webhookEndpointTable.organizationId, organizationId),
        ),
      );

    const [deletedProject] = await tx
      .delete(projectTable)
      .where(and(eq(projectTable.id, projectId), eq(projectTable.organizationId, organizationId)))
      .returning();

    return deletedProject;
  });

  return deleted;
}

export async function dbGetProjectCountByOrganizationId({
  organizationId,
}: {
  organizationId: string;
}): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projectTable)
    .where(eq(projectTable.organizationId, organizationId));

  const count = result?.count ?? 0;

  return count;
}
