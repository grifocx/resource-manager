import { db } from "@db";
import { eq, and } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Team,
  type InsertTeam,
  type Resource,
  type InsertResource,
  type Skill,
  type InsertSkill,
  type WorkItem,
  type InsertWorkItem,
  type Allocation,
  type InsertAllocation,
  type InsertResourceSkill,
  users,
  teams,
  resources,
  skills,
  resourceSkills,
  workItems,
  allocations,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createTeam(team: InsertTeam): Promise<Team>;
  listTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<void>;

  createResource(resource: InsertResource): Promise<Resource>;
  listResources(): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<void>;
  assignSkillToResource(resourceId: number, skillId: number): Promise<void>;
  removeSkillFromResource(resourceId: number, skillId: number): Promise<void>;
  getResourceSkills(resourceId: number): Promise<Skill[]>;

  createSkill(skill: InsertSkill): Promise<Skill>;
  listSkills(): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<void>;

  createWorkItem(workItem: InsertWorkItem): Promise<WorkItem>;
  listWorkItems(): Promise<WorkItem[]>;
  getWorkItem(id: number): Promise<WorkItem | undefined>;
  updateWorkItem(id: number, workItem: Partial<InsertWorkItem>): Promise<WorkItem | undefined>;
  deleteWorkItem(id: number): Promise<void>;

  createAllocation(allocation: InsertAllocation): Promise<Allocation>;
  listAllocations(): Promise<Allocation[]>;
  getAllocationsByResource(resourceId: number): Promise<Allocation[]>;
  getAllocationsByWorkItem(workItemId: number): Promise<Allocation[]>;
  updateAllocation(id: number, allocation: Partial<InsertAllocation>): Promise<Allocation | undefined>;
  deleteAllocation(id: number): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async listTeams(): Promise<Team[]> {
    return db.select().from(teams);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
    return team;
  }

  async updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team | undefined> {
    const [updated] = await db.update(teams).set(team).where(eq(teams.id, id)).returning();
    return updated;
  }

  async deleteTeam(id: number): Promise<void> {
    await db.delete(teams).where(eq(teams.id, id));
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async listResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
    return resource;
  }

  async updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined> {
    const [updated] = await db.update(resources).set(resource).where(eq(resources.id, id)).returning();
    return updated;
  }

  async deleteResource(id: number): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
  }

  async assignSkillToResource(resourceId: number, skillId: number): Promise<void> {
    await db.insert(resourceSkills).values({ resourceId, skillId }).onConflictDoNothing();
  }

  async removeSkillFromResource(resourceId: number, skillId: number): Promise<void> {
    await db.delete(resourceSkills).where(
      and(
        eq(resourceSkills.resourceId, resourceId),
        eq(resourceSkills.skillId, skillId)
      )
    );
  }

  async getResourceSkills(resourceId: number): Promise<Skill[]> {
    const result = await db
      .select({ skill: skills })
      .from(resourceSkills)
      .innerJoin(skills, eq(resourceSkills.skillId, skills.id))
      .where(eq(resourceSkills.resourceId, resourceId));
    return result.map((r: { skill: Skill }) => r.skill);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async listSkills(): Promise<Skill[]> {
    return db.select().from(skills);
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
    return skill;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  async createWorkItem(workItem: InsertWorkItem): Promise<WorkItem> {
    const [newWorkItem] = await db.insert(workItems).values(workItem).returning();
    return newWorkItem;
  }

  async listWorkItems(): Promise<WorkItem[]> {
    return db.select().from(workItems);
  }

  async getWorkItem(id: number): Promise<WorkItem | undefined> {
    const [workItem] = await db.select().from(workItems).where(eq(workItems.id, id)).limit(1);
    return workItem;
  }

  async updateWorkItem(id: number, workItem: Partial<InsertWorkItem>): Promise<WorkItem | undefined> {
    const [updated] = await db.update(workItems).set(workItem).where(eq(workItems.id, id)).returning();
    return updated;
  }

  async deleteWorkItem(id: number): Promise<void> {
    await db.delete(workItems).where(eq(workItems.id, id));
  }

  async createAllocation(allocation: InsertAllocation): Promise<Allocation> {
    const [newAllocation] = await db.insert(allocations).values(allocation).returning();
    return newAllocation;
  }

  async listAllocations(): Promise<Allocation[]> {
    return db.select().from(allocations);
  }

  async getAllocationsByResource(resourceId: number): Promise<Allocation[]> {
    return db.select().from(allocations).where(eq(allocations.resourceId, resourceId));
  }

  async getAllocationsByWorkItem(workItemId: number): Promise<Allocation[]> {
    return db.select().from(allocations).where(eq(allocations.workItemId, workItemId));
  }

  async updateAllocation(id: number, allocation: Partial<InsertAllocation>): Promise<Allocation | undefined> {
    const [updated] = await db.update(allocations).set(allocation).where(eq(allocations.id, id)).returning();
    return updated;
  }

  async deleteAllocation(id: number): Promise<void> {
    await db.delete(allocations).where(eq(allocations.id, id));
  }
}

export const storage = new DbStorage();
