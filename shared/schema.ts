import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, date, decimal, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  headcount: integer("headcount").default(0),
  budget: decimal("budget", { precision: 12, scale: 2 }),
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true });
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  departmentId: integer("department_id").references(() => departments.id),
});

export const insertTeamSchema = createInsertSchema(teams).omit({ id: true });
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  capacity: integer("capacity").notNull().default(40),
  avatar: varchar("avatar", { length: 10 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
});

export const insertResourceSchema = createInsertSchema(resources).omit({ id: true });
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 100 }),
});

export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export const resourceSkills = pgTable("resource_skills", {
  resourceId: integer("resource_id").references(() => resources.id, { onDelete: "cascade" }).notNull(),
  skillId: integer("skill_id").references(() => skills.id, { onDelete: "cascade" }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.resourceId, table.skillId] }),
}));

export const insertResourceSkillSchema = createInsertSchema(resourceSkills);
export type InsertResourceSkill = z.infer<typeof insertResourceSkillSchema>;
export type ResourceSkill = typeof resourceSkills.$inferSelect;

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  owner: varchar("owner", { length: 255 }),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 50 }).default("Active"),
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({ id: true });
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  portfolioId: integer("portfolio_id").references(() => portfolios.id),
  status: varchar("status", { length: 50 }).default("Active"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  programManager: varchar("program_manager", { length: 255 }),
});

export const insertProgramSchema = createInsertSchema(programs).omit({ id: true });
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Program = typeof programs.$inferSelect;

export const workItems = pgTable("work_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  priority: varchar("priority", { length: 50 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  description: text("description").notNull(),
  progress: integer("progress").notNull().default(0),
  programId: integer("program_id").references(() => programs.id),
  estimatedBudget: decimal("estimated_budget", { precision: 12, scale: 2 }),
  actualBudget: decimal("actual_budget", { precision: 12, scale: 2 }),
  estimatedHours: integer("estimated_hours"),
  complexity: varchar("complexity", { length: 50 }),
});

export const insertWorkItemSchema = createInsertSchema(workItems).omit({ id: true });
export type InsertWorkItem = z.infer<typeof insertWorkItemSchema>;
export type WorkItem = typeof workItems.$inferSelect;

export const workItemSkills = pgTable("work_item_skills", {
  workItemId: integer("work_item_id").references(() => workItems.id, { onDelete: "cascade" }).notNull(),
  skillId: integer("skill_id").references(() => skills.id, { onDelete: "cascade" }).notNull(),
  levelRequired: integer("level_required").default(1),
}, (table) => ({
  pk: primaryKey({ columns: [table.workItemId, table.skillId] }),
}));

export const insertWorkItemSkillSchema = createInsertSchema(workItemSkills);
export type InsertWorkItemSkill = z.infer<typeof insertWorkItemSkillSchema>;
export type WorkItemSkill = typeof workItemSkills.$inferSelect;

export const allocations = pgTable("allocations", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").references(() => resources.id, { onDelete: "cascade" }).notNull(),
  workItemId: integer("work_item_id").references(() => workItems.id, { onDelete: "cascade" }).notNull(),
  weekStartDate: date("week_start_date").notNull(),
  hours: decimal("hours", { precision: 5, scale: 2 }).notNull(),
});

export const insertAllocationSchema = createInsertSchema(allocations).omit({ id: true });
export type InsertAllocation = z.infer<typeof insertAllocationSchema>;
export type Allocation = typeof allocations.$inferSelect;
