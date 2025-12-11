import { db } from "@db";
import { eq, and } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Department,
  type InsertDepartment,
  type Team,
  type InsertTeam,
  type Resource,
  type InsertResource,
  type Skill,
  type InsertSkill,
  type Portfolio,
  type InsertPortfolio,
  type Program,
  type InsertProgram,
  type WorkItem,
  type InsertWorkItem,
  type Allocation,
  type InsertAllocation,
  type InsertResourceSkill,
  users,
  departments,
  teams,
  resources,
  skills,
  resourceSkills,
  portfolios,
  programs,
  workItems,
  workItemSkills,
  allocations,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createDepartment(department: InsertDepartment): Promise<Department>;
  listDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department | undefined>;
  deleteDepartment(id: number): Promise<void>;

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

  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  listPortfolios(): Promise<Portfolio[]>;
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<void>;

  createProgram(program: InsertProgram): Promise<Program>;
  listPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  getProgramsByPortfolio(portfolioId: number): Promise<Program[]>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program | undefined>;
  deleteProgram(id: number): Promise<void>;

  createWorkItem(workItem: InsertWorkItem): Promise<WorkItem>;
  listWorkItems(): Promise<WorkItem[]>;
  getWorkItem(id: number): Promise<WorkItem | undefined>;
  getWorkItemsByProgram(programId: number): Promise<WorkItem[]>;
  updateWorkItem(id: number, workItem: Partial<InsertWorkItem>): Promise<WorkItem | undefined>;
  deleteWorkItem(id: number): Promise<void>;

  addWorkItemSkill(workItemId: number, skillId: number, level?: number): Promise<void>;
  removeWorkItemSkill(workItemId: number, skillId: number): Promise<void>;
  getWorkItemSkills(workItemId: number): Promise<Skill[]>;

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

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDept] = await db.insert(departments).values(department).returning();
    return newDept;
  }

  async listDepartments(): Promise<Department[]> {
    return db.select().from(departments);
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    const [dept] = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    return dept;
  }

  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department | undefined> {
    const [updated] = await db.update(departments).set(department).where(eq(departments.id, id)).returning();
    return updated;
  }

  async deleteDepartment(id: number): Promise<void> {
    await db.delete(departments).where(eq(departments.id, id));
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

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const [newPortfolio] = await db.insert(portfolios).values(portfolio).returning();
    return newPortfolio;
  }

  async listPortfolios(): Promise<Portfolio[]> {
    return db.select().from(portfolios);
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
    return portfolio;
  }

  async updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const [updated] = await db.update(portfolios).set(portfolio).where(eq(portfolios.id, id)).returning();
    return updated;
  }

  async deletePortfolio(id: number): Promise<void> {
    await db.delete(portfolios).where(eq(portfolios.id, id));
  }

  async createProgram(program: InsertProgram): Promise<Program> {
    const [newProgram] = await db.insert(programs).values(program).returning();
    return newProgram;
  }

  async listPrograms(): Promise<Program[]> {
    return db.select().from(programs);
  }

  async getProgram(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id)).limit(1);
    return program;
  }

  async getProgramsByPortfolio(portfolioId: number): Promise<Program[]> {
    return db.select().from(programs).where(eq(programs.portfolioId, portfolioId));
  }

  async updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program | undefined> {
    const [updated] = await db.update(programs).set(program).where(eq(programs.id, id)).returning();
    return updated;
  }

  async deleteProgram(id: number): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
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

  async getWorkItemsByProgram(programId: number): Promise<WorkItem[]> {
    return db.select().from(workItems).where(eq(workItems.programId, programId));
  }

  async updateWorkItem(id: number, workItem: Partial<InsertWorkItem>): Promise<WorkItem | undefined> {
    const [updated] = await db.update(workItems).set(workItem).where(eq(workItems.id, id)).returning();
    return updated;
  }

  async deleteWorkItem(id: number): Promise<void> {
    await db.delete(workItems).where(eq(workItems.id, id));
  }

  async addWorkItemSkill(workItemId: number, skillId: number, level = 1): Promise<void> {
    await db.insert(workItemSkills).values({ workItemId, skillId, levelRequired: level }).onConflictDoNothing();
  }

  async removeWorkItemSkill(workItemId: number, skillId: number): Promise<void> {
    await db.delete(workItemSkills).where(
      and(
        eq(workItemSkills.workItemId, workItemId),
        eq(workItemSkills.skillId, skillId)
      )
    );
  }

  async getWorkItemSkills(workItemId: number): Promise<Skill[]> {
    const result = await db
      .select({ skill: skills })
      .from(workItemSkills)
      .innerJoin(skills, eq(workItemSkills.skillId, skills.id))
      .where(eq(workItemSkills.workItemId, workItemId));
    return result.map((r: { skill: Skill }) => r.skill);
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
