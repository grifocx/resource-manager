import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertDepartmentSchema,
  insertTeamSchema,
  insertResourceSchema,
  insertSkillSchema,
  insertPortfolioSchema,
  insertProgramSchema,
  insertWorkItemSchema,
  insertAllocationSchema,
  insertWorkItemSkillSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { suggestResources, autoAllocate, shiftAllocations } from "./planning";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Departments
  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.listDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch departments" });
    }
  });

  app.post("/api/departments", async (req, res) => {
    try {
      const validated = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(validated);
      res.status(201).json(department);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create department" });
      }
    }
  });

  app.get("/api/departments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid department ID" });
      }
      const department = await storage.getDepartment(id);
      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }
      res.json(department);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch department" });
    }
  });

  app.patch("/api/departments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid department ID" });
      }
      const validated = insertDepartmentSchema.partial().parse(req.body);
      const department = await storage.updateDepartment(id, validated);
      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }
      res.json(department);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to update department" });
      }
    }
  });

  app.delete("/api/departments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid department ID" });
      }
      await storage.deleteDepartment(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete department" });
    }
  });

  // Teams
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.listTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const validated = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validated);
      res.status(201).json(team);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create team" });
      }
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid team ID" });
      }
      const team = await storage.getTeam(id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.patch("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid team ID" });
      }
      const validated = insertTeamSchema.partial().parse(req.body);
      const team = await storage.updateTeam(id, validated);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to update team" });
      }
    }
  });

  app.delete("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid team ID" });
      }
      await storage.deleteTeam(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team" });
    }
  });

  // Resources
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.listResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const validated = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validated);
      res.status(201).json(resource);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create resource" });
      }
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid resource ID" });
      }
      const resource = await storage.getResource(id);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  });

  app.patch("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid resource ID" });
      }
      const validated = insertResourceSchema.partial().parse(req.body);
      const resource = await storage.updateResource(id, validated);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to update resource" });
      }
    }
  });

  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid resource ID" });
      }
      await storage.deleteResource(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete resource" });
    }
  });

  app.get("/api/resources/:id/skills", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid resource ID" });
      }
      const skills = await storage.getResourceSkills(id);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resource skills" });
    }
  });

  app.post("/api/resources/:id/skills", async (req, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      if (isNaN(resourceId)) {
        return res.status(400).json({ error: "Invalid resource ID" });
      }
      const { skillId } = req.body;
      if (typeof skillId !== "number") {
        return res.status(400).json({ error: "skillId must be a number" });
      }
      await storage.assignSkillToResource(resourceId, skillId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to assign skill to resource" });
    }
  });

  app.delete("/api/resources/:id/skills/:skillId", async (req, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      const skillId = parseInt(req.params.skillId);
      if (isNaN(resourceId) || isNaN(skillId)) {
        return res.status(400).json({ error: "Invalid resource or skill ID" });
      }
      await storage.removeSkillFromResource(resourceId, skillId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove skill from resource" });
    }
  });

  // Skills
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.listSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const validated = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validated);
      res.status(201).json(skill);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create skill" });
      }
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid skill ID" });
      }
      await storage.deleteSkill(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // Portfolios
  app.get("/api/portfolios", async (req, res) => {
    try {
      const portfolios = await storage.listPortfolios();
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolios" });
    }
  });

  app.post("/api/portfolios", async (req, res) => {
    try {
      const validated = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(validated);
      res.status(201).json(portfolio);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create portfolio" });
      }
    }
  });

  app.get("/api/portfolios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid portfolio ID" });
      }
      const portfolio = await storage.getPortfolio(id);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  app.get("/api/portfolios/:id/programs", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid portfolio ID" });
      }
      const programs = await storage.getProgramsByPortfolio(id);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio programs" });
    }
  });

  app.patch("/api/portfolios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid portfolio ID" });
      }
      const validated = insertPortfolioSchema.partial().parse(req.body);
      const portfolio = await storage.updatePortfolio(id, validated);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to update portfolio" });
      }
    }
  });

  app.delete("/api/portfolios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid portfolio ID" });
      }
      await storage.deletePortfolio(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete portfolio" });
    }
  });

  // Programs
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.listPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch programs" });
    }
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const validated = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validated);
      res.status(201).json(program);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create program" });
      }
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid program ID" });
      }
      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch program" });
    }
  });

  app.get("/api/programs/:id/work-items", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid program ID" });
      }
      const workItems = await storage.getWorkItemsByProgram(id);
      res.json(workItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch program work items" });
    }
  });

  app.patch("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid program ID" });
      }
      const validated = insertProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(id, validated);
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.json(program);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to update program" });
      }
    }
  });

  app.delete("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid program ID" });
      }
      await storage.deleteProgram(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete program" });
    }
  });

  // Work Items
  app.get("/api/work-items", async (req, res) => {
    try {
      const workItems = await storage.listWorkItems();
      res.json(workItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch work items" });
    }
  });

  app.post("/api/work-items", async (req, res) => {
    try {
      const validated = insertWorkItemSchema.parse(req.body);
      const workItem = await storage.createWorkItem(validated);
      res.status(201).json(workItem);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create work item" });
      }
    }
  });

  app.get("/api/work-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid work item ID" });
      }
      const workItem = await storage.getWorkItem(id);
      if (!workItem) {
        return res.status(404).json({ error: "Work item not found" });
      }
      res.json(workItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch work item" });
    }
  });

  app.patch("/api/work-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid work item ID" });
      }
      const validated = insertWorkItemSchema.partial().parse(req.body);
      const workItem = await storage.updateWorkItem(id, validated);
      if (!workItem) {
        return res.status(404).json({ error: "Work item not found" });
      }

      // Reactivity: If dates changed, shift allocations
      if (req.body.startDate || req.body.endDate) {
        // Run in background or await? Await to ensure consistency for now.
        try {
          await shiftAllocations(id);
        } catch (e) {
          console.error("Failed to shift allocations", e);
          // Don't fail the request, just log
        }
      }

      res.json(workItem);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to update work item" });
      }
    }
  });

  app.delete("/api/work-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid work item ID" });
      }
      await storage.deleteWorkItem(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete work item" });
    }
  });

  // Planning
  app.post("/api/planning/suggest-resources", async (req, res) => {
    try {
      const { workItemId } = req.body;
      if (!workItemId) {
        return res.status(400).json({ error: "Missing workItemId" });
      }
      const suggestions = await suggestResources(parseInt(workItemId));
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to suggest resources", details: error.message });
    }
  });

  app.post("/api/planning/allocate", async (req, res) => {
    try {
      const { resourceId, workItemId, totalHours } = req.body;
      if (!resourceId || !workItemId || !totalHours) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const result = await autoAllocate(parseInt(resourceId), parseInt(workItemId), parseFloat(totalHours));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to allocate resources", details: error.message });
    }
  });

  // Work Item Skills
  app.get("/api/work-items/:id/skills", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid work item ID" });
      }
      const skills = await storage.getWorkItemSkills(id);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch work item skills" });
    }
  });

  app.post("/api/work-items/:id/skills", async (req, res) => {
    try {
      const workItemId = parseInt(req.params.id);
      const { skillId, levelRequired } = req.body;

      if (!skillId) {
        return res.status(400).json({ error: "Missing skillId" });
      }

      await storage.addWorkItemSkill(workItemId, parseInt(skillId), levelRequired ? parseInt(levelRequired) : 1);
      res.status(201).json({ success: true });
    } catch (error: any) {
       res.status(500).json({ error: "Failed to add skill to work item" });
    }
  });

  app.delete("/api/work-items/:id/skills/:skillId", async (req, res) => {
    try {
      const workItemId = parseInt(req.params.id);
      const skillId = parseInt(req.params.skillId);

      if (isNaN(workItemId) || isNaN(skillId)) {
        return res.status(400).json({ error: "Invalid IDs" });
      }

      await storage.removeWorkItemSkill(workItemId, skillId);
      res.status(204).send();
    } catch (error: any) {
       res.status(500).json({ error: "Failed to remove skill from work item" });
    }
  });


  // Allocations
  app.get("/api/allocations", async (req, res) => {
    try {
      const allocations = await storage.listAllocations();
      res.json(allocations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch allocations" });
    }
  });

  app.post("/api/allocations", async (req, res) => {
    try {
      const validated = insertAllocationSchema.parse(req.body);
      const allocation = await storage.createAllocation(validated);
      res.status(201).json(allocation);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create allocation" });
      }
    }
  });

  app.get("/api/allocations/resource/:resourceId", async (req, res) => {
    try {
      const resourceId = parseInt(req.params.resourceId);
      if (isNaN(resourceId)) {
        return res.status(400).json({ error: "Invalid resource ID" });
      }
      const allocations = await storage.getAllocationsByResource(resourceId);
      res.json(allocations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch allocations for resource" });
    }
  });

  app.get("/api/allocations/work-item/:workItemId", async (req, res) => {
    try {
      const workItemId = parseInt(req.params.workItemId);
      if (isNaN(workItemId)) {
        return res.status(400).json({ error: "Invalid work item ID" });
      }
      const allocations = await storage.getAllocationsByWorkItem(workItemId);
      res.json(allocations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch allocations for work item" });
    }
  });

  app.patch("/api/allocations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid allocation ID" });
      }
      const validated = insertAllocationSchema.partial().parse(req.body);
      const allocation = await storage.updateAllocation(id, validated);
      if (!allocation) {
        return res.status(404).json({ error: "Allocation not found" });
      }
      res.json(allocation);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to update allocation" });
      }
    }
  });

  app.delete("/api/allocations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid allocation ID" });
      }
      await storage.deleteAllocation(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete allocation" });
    }
  });

  app.post("/api/seed-production", async (req, res) => {
    try {
      const secretKey = req.query.key || req.body.key;
      if (secretKey !== "seed-resource-it-2025") {
        return res.status(403).json({ error: "Invalid seed key" });
      }

      const existingResources = await storage.listResources();
      if (existingResources.length > 0) {
        return res.status(400).json({ 
          error: "Database already has data. Seeding is only allowed on empty databases.",
          resourceCount: existingResources.length
        });
      }

      const dept1 = await storage.createDepartment({ name: "Enterprise Services", description: "Business applications, analytics, and enterprise architecture", headcount: 75, budget: "22000000.00" });
      const dept2 = await storage.createDepartment({ name: "IT Operations", description: "Infrastructure, security, network, and end user computing", headcount: 75, budget: "18000000.00" });

      const teams = await Promise.all([
        storage.createTeam({ name: "Enterprise Applications", color: "bg-blue-500", departmentId: dept1.id }),
        storage.createTeam({ name: "Business Intelligence", color: "bg-purple-500", departmentId: dept1.id }),
        storage.createTeam({ name: "Enterprise Architecture", color: "bg-indigo-500", departmentId: dept1.id }),
        storage.createTeam({ name: "Integration Services", color: "bg-cyan-500", departmentId: dept1.id }),
        storage.createTeam({ name: "Development & DevOps", color: "bg-teal-500", departmentId: dept1.id }),
        storage.createTeam({ name: "Infrastructure & Cloud", color: "bg-orange-500", departmentId: dept2.id }),
        storage.createTeam({ name: "Network Operations", color: "bg-red-500", departmentId: dept2.id }),
        storage.createTeam({ name: "Security Operations", color: "bg-rose-500", departmentId: dept2.id }),
        storage.createTeam({ name: "End User Computing", color: "bg-amber-500", departmentId: dept2.id }),
        storage.createTeam({ name: "Service Desk", color: "bg-yellow-500", departmentId: dept2.id }),
      ]);
      const teamMap = Object.fromEntries(teams.map(t => [t.name, t.id]));

      await Promise.all([
        storage.createSkill({ name: "AWS", category: "Cloud" }),
        storage.createSkill({ name: "Azure", category: "Cloud" }),
        storage.createSkill({ name: "Kubernetes", category: "Cloud" }),
        storage.createSkill({ name: "Terraform", category: "Infrastructure" }),
        storage.createSkill({ name: "Python", category: "Development" }),
        storage.createSkill({ name: "Java", category: "Development" }),
        storage.createSkill({ name: "TypeScript", category: "Development" }),
        storage.createSkill({ name: "React", category: "Development" }),
        storage.createSkill({ name: "SQL", category: "Data" }),
        storage.createSkill({ name: "Power BI", category: "Analytics" }),
        storage.createSkill({ name: "Tableau", category: "Analytics" }),
        storage.createSkill({ name: "ServiceNow", category: "ITSM" }),
        storage.createSkill({ name: "Cisco Networking", category: "Network" }),
        storage.createSkill({ name: "VMware", category: "Virtualization" }),
        storage.createSkill({ name: "Active Directory", category: "Identity" }),
        storage.createSkill({ name: "Okta", category: "Identity" }),
        storage.createSkill({ name: "Splunk", category: "Security" }),
        storage.createSkill({ name: "CrowdStrike", category: "Security" }),
        storage.createSkill({ name: "SAP", category: "ERP" }),
        storage.createSkill({ name: "Salesforce", category: "CRM" }),
      ]);

      const resourceData = [
        { name: "Sarah Chen", role: "Director, Enterprise Apps", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "SC", email: "sarah.chen@company.com", hourlyRate: "125.00" },
        { name: "Marcus Johnson", role: "SAP Technical Lead", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "MJ", email: "marcus.j@company.com", hourlyRate: "110.00" },
        { name: "Elena Rodriguez", role: "Salesforce Developer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "ER", email: "elena.r@company.com", hourlyRate: "95.00" },
        { name: "David Kim", role: "SAP Functional Analyst", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "DK", email: "david.k@company.com", hourlyRate: "90.00" },
        { name: "Jennifer Walsh", role: "CRM Specialist", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "JW", email: "jennifer.w@company.com", hourlyRate: "85.00" },
        { name: "Brian O'Connor", role: "Director, BI", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "BO", email: "brian.o@company.com", hourlyRate: "120.00" },
        { name: "Rachel Green", role: "Lead Data Analyst", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "RG", email: "rachel.g@company.com", hourlyRate: "100.00" },
        { name: "Thomas Anderson", role: "Data Engineer", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "TA", email: "thomas.a@company.com", hourlyRate: "100.00" },
        { name: "Patrick Hughes", role: "Chief Architect", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "PH", email: "patrick.h@company.com", hourlyRate: "150.00" },
        { name: "George Mitchell", role: "Cloud Architect", teamId: teamMap["Enterprise Architecture"], capacity: 40, avatar: "GM", email: "george.m@company.com", hourlyRate: "135.00" },
        { name: "Henry Collins", role: "Manager, Integration", teamId: teamMap["Integration Services"], capacity: 40, avatar: "HC", email: "henry.c@company.com", hourlyRate: "105.00" },
        { name: "Richard Rivera", role: "Director, DevOps", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "RR", email: "richard.r@company.com", hourlyRate: "125.00" },
        { name: "Sandra Cooper", role: "Lead DevOps Engineer", teamId: teamMap["Development & DevOps"], capacity: 40, avatar: "SC", email: "sandra.c@company.com", hourlyRate: "115.00" },
        { name: "Maria Price", role: "Director, Infrastructure", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "MP", email: "maria.p@company.com", hourlyRate: "125.00" },
        { name: "Ronald Bennett", role: "Cloud Platform Lead", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "RB", email: "ronald.b@company.com", hourlyRate: "115.00" },
        { name: "Helen Wood", role: "AWS Engineer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "HW", email: "helen.w@company.com", hourlyRate: "105.00" },
        { name: "Scott Barnes", role: "Azure Engineer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "SB", email: "scott.b@company.com", hourlyRate: "105.00" },
        { name: "Kimberly Ross", role: "Kubernetes Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "KR", email: "kim.r@company.com", hourlyRate: "100.00" },
        { name: "Donald Henderson", role: "VMware Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "DH", email: "donald.h@company.com", hourlyRate: "95.00" },
        { name: "Deborah Coleman", role: "Storage Admin", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "DC", email: "deborah.c@company.com", hourlyRate: "90.00" },
        { name: "Debra Long", role: "Terraform Developer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "DL", email: "debra.l@company.com", hourlyRate: "95.00" },
        { name: "Laura Hughes", role: "Cloud Ops Engineer", teamId: teamMap["Infrastructure & Cloud"], capacity: 40, avatar: "LH", email: "laura.h@company.com", hourlyRate: "95.00" },
        { name: "Catherine Gonzales", role: "Manager, Network Ops", teamId: teamMap["Network Operations"], capacity: 40, avatar: "CG", email: "catherine.g@company.com", hourlyRate: "110.00" },
        { name: "Joe Bryant", role: "Network Architect", teamId: teamMap["Network Operations"], capacity: 40, avatar: "JB", email: "joe.b@company.com", hourlyRate: "115.00" },
        { name: "Jean Alexander", role: "Sr. Network Engineer", teamId: teamMap["Network Operations"], capacity: 40, avatar: "JA", email: "jean.a@company.com", hourlyRate: "100.00" },
        { name: "Teresa Griffin", role: "Network Engineer", teamId: teamMap["Network Operations"], capacity: 40, avatar: "TG", email: "teresa.g@company.com", hourlyRate: "90.00" },
        { name: "Philip Myers", role: "VoIP Engineer", teamId: teamMap["Network Operations"], capacity: 40, avatar: "PM", email: "philip.m@company.com", hourlyRate: "85.00" },
        { name: "Kathleen West", role: "CISO", teamId: teamMap["Security Operations"], capacity: 40, avatar: "KW", email: "kathleen.w@company.com", hourlyRate: "150.00" },
        { name: "Ralph Chavez", role: "Security Manager", teamId: teamMap["Security Operations"], capacity: 40, avatar: "RC", email: "ralph.c@company.com", hourlyRate: "120.00" },
        { name: "Theresa Owens", role: "Security Architect", teamId: teamMap["Security Operations"], capacity: 40, avatar: "TO", email: "theresa.o@company.com", hourlyRate: "125.00" },
        { name: "Eugene Knight", role: "SOC Lead", teamId: teamMap["Security Operations"], capacity: 40, avatar: "EK", email: "eugene.k@company.com", hourlyRate: "100.00" },
        { name: "Gloria Black", role: "SOC Analyst", teamId: teamMap["Security Operations"], capacity: 40, avatar: "GB", email: "gloria.b@company.com", hourlyRate: "80.00" },
        { name: "Harold Stone", role: "IAM Specialist", teamId: teamMap["Security Operations"], capacity: 40, avatar: "HS", email: "harold.s@company.com", hourlyRate: "95.00" },
        { name: "Louis Sims", role: "Compliance Analyst", teamId: teamMap["Security Operations"], capacity: 40, avatar: "LS", email: "louis.s@company.com", hourlyRate: "85.00" },
        { name: "Anne Webb", role: "Incident Responder", teamId: teamMap["Security Operations"], capacity: 40, avatar: "AW", email: "anne.w@company.com", hourlyRate: "95.00" },
        { name: "Shawn Gardner", role: "Security Engineer", teamId: teamMap["Security Operations"], capacity: 40, avatar: "SG", email: "shawn.g@company.com", hourlyRate: "100.00" },
        { name: "Russell Ford", role: "Manager, EUC", teamId: teamMap["End User Computing"], capacity: 40, avatar: "RF", email: "russell.f@company.com", hourlyRate: "100.00" },
        { name: "Eugene Cruz", role: "VDI Admin", teamId: teamMap["End User Computing"], capacity: 40, avatar: "EC", email: "eugene.c@company.com", hourlyRate: "90.00" },
        { name: "Norma Dunn", role: "Service Desk Manager", teamId: teamMap["Service Desk"], capacity: 40, avatar: "ND", email: "norma.d@company.com", hourlyRate: "85.00" },
        { name: "Lisa Patel", role: "ServiceNow Developer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "LP", email: "lisa.p@company.com", hourlyRate: "90.00" },
        { name: "Kevin Park", role: "Power BI Developer", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "KP", email: "kevin.p@company.com", hourlyRate: "90.00" },
        { name: "William Clark", role: "ETL Developer", teamId: teamMap["Business Intelligence"], capacity: 40, avatar: "WC", email: "william.c@company.com", hourlyRate: "95.00" },
        { name: "Andrew Wilson", role: "Solutions Architect", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "AW", email: "andrew.w@company.com", hourlyRate: "115.00" },
        { name: "Robert Taylor", role: "ERP Analyst", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "RT", email: "robert.t@company.com", hourlyRate: "85.00" },
        { name: "Christopher Lee", role: "SAP Developer", teamId: teamMap["Enterprise Applications"], capacity: 40, avatar: "CL", email: "chris.l@company.com", hourlyRate: "95.00" },
      ];

      const insertedResources = await Promise.all(resourceData.map(r => storage.createResource(r)));
      const resourceMap = Object.fromEntries(insertedResources.map(r => [r.name, r.id]));

      const portfolioData = [
        { name: "Infrastructure Portfolio", description: "Cloud migration, data center, and infrastructure modernization initiatives", owner: "Maria Price", budget: "12000000.00", status: "Active" },
        { name: "Applications Portfolio", description: "Enterprise application development, integration, and modernization", owner: "Sarah Chen", budget: "10000000.00", status: "Active" },
        { name: "Security Portfolio", description: "Security posture improvement, compliance, and risk reduction initiatives", owner: "Kathleen West", budget: "8000000.00", status: "Active" },
        { name: "Data & Analytics Portfolio", description: "Data platform, analytics capabilities, and AI/ML initiatives", owner: "Brian O'Connor", budget: "6000000.00", status: "Active" },
        { name: "Digital Workplace Portfolio", description: "End user experience, collaboration, and productivity improvements", owner: "Russell Ford", budget: "4000000.00", status: "Active" },
      ];
      const insertedPortfolios = await Promise.all(portfolioData.map(p => storage.createPortfolio(p)));
      const portfolioMap = Object.fromEntries(insertedPortfolios.map(p => [p.name, p.id]));

      const programData = [
        { name: "Path to Cloud", portfolioId: portfolioMap["Infrastructure Portfolio"], description: "Migration of on-premises workloads to AWS and Azure", status: "Active", startDate: "2024-01-01", endDate: "2025-12-31", budget: "5000000.00", programManager: "Ronald Bennett" },
        { name: "Data Center Consolidation", portfolioId: portfolioMap["Infrastructure Portfolio"], description: "Reduce footprint from 3 data centers to 1 primary + cloud", status: "Active", startDate: "2024-06-01", endDate: "2026-06-30", budget: "3500000.00", programManager: "Maria Price" },
        { name: "Network Modernization", portfolioId: portfolioMap["Infrastructure Portfolio"], description: "SD-WAN rollout and network refresh across all locations", status: "Active", startDate: "2025-01-01", endDate: "2025-12-31", budget: "2500000.00", programManager: "Joe Bryant" },
        { name: "ERP Transformation", portfolioId: portfolioMap["Applications Portfolio"], description: "SAP S/4HANA migration and business process optimization", status: "Active", startDate: "2024-03-01", endDate: "2026-03-31", budget: "4000000.00", programManager: "Marcus Johnson" },
        { name: "CRM Enhancement", portfolioId: portfolioMap["Applications Portfolio"], description: "Salesforce optimization and customer 360 implementation", status: "Active", startDate: "2025-01-01", endDate: "2025-09-30", budget: "1500000.00", programManager: "Elena Rodriguez" },
        { name: "Integration Platform", portfolioId: portfolioMap["Applications Portfolio"], description: "Enterprise iPaaS implementation and API management", status: "Active", startDate: "2024-09-01", endDate: "2025-06-30", budget: "1200000.00", programManager: "Henry Collins" },
        { name: "DevOps Acceleration", portfolioId: portfolioMap["Applications Portfolio"], description: "CI/CD pipeline standardization and developer experience", status: "Active", startDate: "2025-02-01", endDate: "2025-08-31", budget: "800000.00", programManager: "Richard Rivera" },
        { name: "Zero Trust Initiative", portfolioId: portfolioMap["Security Portfolio"], description: "Implement zero trust architecture across the enterprise", status: "Active", startDate: "2024-04-01", endDate: "2025-12-31", budget: "3000000.00", programManager: "Ralph Chavez" },
        { name: "Compliance Modernization", portfolioId: portfolioMap["Security Portfolio"], description: "SOC 2 Type II certification and GRC platform implementation", status: "Active", startDate: "2025-01-01", endDate: "2025-12-31", budget: "1500000.00", programManager: "Louis Sims" },
        { name: "Security Operations Center", portfolioId: portfolioMap["Security Portfolio"], description: "24x7 SOC capability with SOAR automation", status: "Active", startDate: "2024-07-01", endDate: "2025-06-30", budget: "2000000.00", programManager: "Eugene Knight" },
        { name: "Data Platform Modernization", portfolioId: portfolioMap["Data & Analytics Portfolio"], description: "Cloud data lake and modern data stack implementation", status: "Active", startDate: "2024-08-01", endDate: "2025-07-31", budget: "2500000.00", programManager: "Thomas Anderson" },
        { name: "Self-Service Analytics", portfolioId: portfolioMap["Data & Analytics Portfolio"], description: "Enterprise BI platform and data democratization", status: "Active", startDate: "2025-01-01", endDate: "2025-09-30", budget: "1200000.00", programManager: "Rachel Green" },
        { name: "AI/ML Foundation", portfolioId: portfolioMap["Data & Analytics Portfolio"], description: "ML platform and AI use case pilots", status: "Planned", startDate: "2025-07-01", endDate: "2026-06-30", budget: "1500000.00", programManager: "James Robinson" },
        { name: "Modern Workplace", portfolioId: portfolioMap["Digital Workplace Portfolio"], description: "Microsoft 365 optimization and Teams adoption", status: "Active", startDate: "2024-10-01", endDate: "2025-06-30", budget: "1200000.00", programManager: "Russell Ford" },
        { name: "VDI Transformation", portfolioId: portfolioMap["Digital Workplace Portfolio"], description: "Virtual desktop infrastructure refresh and Windows 365", status: "Active", startDate: "2025-03-01", endDate: "2025-12-31", budget: "1500000.00", programManager: "Eugene Cruz" },
        { name: "Service Excellence", portfolioId: portfolioMap["Digital Workplace Portfolio"], description: "ServiceNow enhancement and self-service capabilities", status: "Active", startDate: "2025-01-01", endDate: "2025-09-30", budget: "800000.00", programManager: "Norma Dunn" },
      ];
      const insertedPrograms = await Promise.all(programData.map(p => storage.createProgram(p)));
      const programMap = Object.fromEntries(insertedPrograms.map(p => [p.name, p.id]));

      const workItemData = [
        { title: "AWS Landing Zone Setup", type: "Project", status: "Completed", priority: "High", startDate: "2024-01-15", endDate: "2024-04-30", description: "Establish AWS organization structure, accounts, and security baseline", progress: 100, programId: programMap["Path to Cloud"], estimatedBudget: "250000.00", actualBudget: "235000.00" },
        { title: "Azure Landing Zone Setup", type: "Project", status: "Completed", priority: "High", startDate: "2024-02-01", endDate: "2024-05-31", description: "Configure Azure subscriptions, policies, and networking", progress: 100, programId: programMap["Path to Cloud"], estimatedBudget: "200000.00", actualBudget: "195000.00" },
        { title: "Application Assessment Wave 1", type: "Project", status: "In Progress", priority: "High", startDate: "2024-06-01", endDate: "2025-01-31", description: "Assess and migrate first 50 applications to cloud", progress: 75, programId: programMap["Path to Cloud"], estimatedBudget: "800000.00", actualBudget: "620000.00" },
        { title: "Database Migration - SQL Server", type: "Project", status: "In Progress", priority: "High", startDate: "2024-09-01", endDate: "2025-03-31", description: "Migrate SQL Server databases to Azure SQL and RDS", progress: 45, programId: programMap["Path to Cloud"], estimatedBudget: "500000.00", actualBudget: "180000.00" },
        { title: "Cloud Cost Optimization", type: "KTLO", status: "In Progress", priority: "Medium", startDate: "2024-06-01", endDate: "2025-12-31", description: "Ongoing cloud cost management and rightsizing", progress: 50, programId: programMap["Path to Cloud"], estimatedBudget: "100000.00", actualBudget: "45000.00" },
        { title: "Kubernetes Platform Enhancement", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-01-01", endDate: "2025-06-30", description: "EKS/AKS platform hardening and observability", progress: 25, programId: programMap["Path to Cloud"], estimatedBudget: "300000.00", actualBudget: "75000.00" },
        { title: "SAP S/4HANA Assessment", type: "Project", status: "Completed", priority: "High", startDate: "2024-03-01", endDate: "2024-06-30", description: "Current state assessment and fit-gap analysis", progress: 100, programId: programMap["ERP Transformation"], estimatedBudget: "400000.00", actualBudget: "380000.00" },
        { title: "Finance Module Go-Live", type: "Project", status: "In Progress", priority: "Critical", startDate: "2024-11-01", endDate: "2025-06-30", description: "Finance and controlling module implementation", progress: 55, programId: programMap["ERP Transformation"], estimatedBudget: "1200000.00", actualBudget: "720000.00" },
        { title: "SAP Basis Support", type: "KTLO", status: "In Progress", priority: "High", startDate: "2024-03-01", endDate: "2026-03-31", description: "Ongoing SAP system administration and support", progress: 40, programId: programMap["ERP Transformation"], estimatedBudget: "600000.00", actualBudget: "280000.00" },
        { title: "Data Migration - Master Data", type: "Project", status: "In Progress", priority: "High", startDate: "2025-01-01", endDate: "2025-04-30", description: "Customer, vendor, and material master data cleansing and migration", progress: 30, programId: programMap["ERP Transformation"], estimatedBudget: "250000.00", actualBudget: "65000.00" },
        { title: "Identity Platform Upgrade", type: "Project", status: "In Progress", priority: "Critical", startDate: "2024-04-01", endDate: "2025-02-28", description: "Migrate to Okta and implement advanced identity governance", progress: 70, programId: programMap["Zero Trust Initiative"], estimatedBudget: "800000.00", actualBudget: "520000.00" },
        { title: "Endpoint Detection & Response", type: "Project", status: "Completed", priority: "High", startDate: "2024-05-01", endDate: "2024-09-30", description: "Deploy CrowdStrike across all endpoints", progress: 100, programId: programMap["Zero Trust Initiative"], estimatedBudget: "500000.00", actualBudget: "485000.00" },
        { title: "Micro-Segmentation Pilot", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-01-01", endDate: "2025-06-30", description: "Implement network micro-segmentation in data center", progress: 20, programId: programMap["Zero Trust Initiative"], estimatedBudget: "400000.00", actualBudget: "60000.00" },
        { title: "Security Patching", type: "KTLO", status: "In Progress", priority: "Critical", startDate: "2024-01-01", endDate: "2025-12-31", description: "Monthly vulnerability patching across all systems", progress: 50, programId: programMap["Zero Trust Initiative"], estimatedBudget: "200000.00", actualBudget: "95000.00" },
        { title: "DC2 Server Migration", type: "Project", status: "In Progress", priority: "High", startDate: "2024-06-01", endDate: "2025-03-31", description: "Migrate workloads from secondary data center", progress: 60, programId: programMap["Data Center Consolidation"], estimatedBudget: "1200000.00", actualBudget: "680000.00" },
        { title: "Storage Refresh", type: "Project", status: "In Progress", priority: "Medium", startDate: "2024-09-01", endDate: "2025-02-28", description: "Replace aging NetApp with Pure Storage all-flash", progress: 85, programId: programMap["Data Center Consolidation"], estimatedBudget: "800000.00", actualBudget: "720000.00" },
        { title: "Salesforce CPQ Implementation", type: "Project", status: "In Progress", priority: "High", startDate: "2025-01-15", endDate: "2025-05-31", description: "Configure and deploy Salesforce CPQ for sales team", progress: 35, programId: programMap["CRM Enhancement"], estimatedBudget: "400000.00", actualBudget: "125000.00" },
        { title: "Customer 360 Dashboard", type: "Project", status: "In Progress", priority: "High", startDate: "2025-02-01", endDate: "2025-04-30", description: "Build unified customer view across all touchpoints", progress: 50, programId: programMap["CRM Enhancement"], estimatedBudget: "180000.00", actualBudget: "85000.00" },
        { title: "Snowflake Data Lake", type: "Project", status: "In Progress", priority: "High", startDate: "2024-08-01", endDate: "2025-02-28", description: "Establish Snowflake as central data platform", progress: 80, programId: programMap["Data Platform Modernization"], estimatedBudget: "600000.00", actualBudget: "510000.00" },
        { title: "Data Governance Framework", type: "Project", status: "In Progress", priority: "High", startDate: "2024-10-01", endDate: "2025-04-30", description: "Implement Collibra for data cataloging and governance", progress: 55, programId: programMap["Data Platform Modernization"], estimatedBudget: "400000.00", actualBudget: "195000.00" },
        { title: "ETL Pipeline Migration", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-01-01", endDate: "2025-06-30", description: "Migrate legacy ETL to dbt and Airflow", progress: 25, programId: programMap["Data Platform Modernization"], estimatedBudget: "350000.00", actualBudget: "75000.00" },
        { title: "Data Quality Monitoring", type: "KTLO", status: "In Progress", priority: "Medium", startDate: "2024-11-01", endDate: "2025-07-31", description: "Ongoing data quality checks and remediation", progress: 40, programId: programMap["Data Platform Modernization"], estimatedBudget: "150000.00", actualBudget: "55000.00" },
        { title: "Teams Phone System Rollout", type: "Project", status: "In Progress", priority: "High", startDate: "2024-10-01", endDate: "2025-03-31", description: "Migrate from legacy PBX to Microsoft Teams Phone", progress: 65, programId: programMap["Modern Workplace"], estimatedBudget: "400000.00", actualBudget: "245000.00" },
        { title: "SharePoint Migration", type: "Project", status: "Completed", priority: "High", startDate: "2024-10-15", endDate: "2025-01-31", description: "Migrate file shares to SharePoint Online", progress: 100, programId: programMap["Modern Workplace"], estimatedBudget: "200000.00", actualBudget: "185000.00" },
        { title: "Copilot Pilot Program", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-02-01", endDate: "2025-05-31", description: "Microsoft 365 Copilot pilot with 100 users", progress: 15, programId: programMap["Modern Workplace"], estimatedBudget: "150000.00", actualBudget: "20000.00" },
        { title: "ServiceNow ITSM Upgrade", type: "Project", status: "In Progress", priority: "High", startDate: "2025-01-01", endDate: "2025-04-30", description: "Upgrade to latest ServiceNow version with new features", progress: 40, programId: programMap["Service Excellence"], estimatedBudget: "300000.00", actualBudget: "110000.00" },
        { title: "Tier 0 Automation", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-02-01", endDate: "2025-06-30", description: "Implement chatbot and automated ticket resolution", progress: 20, programId: programMap["Service Excellence"], estimatedBudget: "180000.00", actualBudget: "35000.00" },
        { title: "Wireless Refresh", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-01-15", endDate: "2025-06-30", description: "Replace aging WiFi infrastructure with WiFi 6E", progress: 30, programId: programMap["Network Modernization"], estimatedBudget: "600000.00", actualBudget: "160000.00" },
        { title: "SIEM Migration to Splunk Cloud", type: "Project", status: "In Progress", priority: "High", startDate: "2024-07-01", endDate: "2025-01-31", description: "Migrate on-prem SIEM to Splunk Cloud", progress: 85, programId: programMap["Security Operations Center"], estimatedBudget: "500000.00", actualBudget: "420000.00" },
        { title: "SOAR Implementation", type: "Project", status: "In Progress", priority: "High", startDate: "2024-10-01", endDate: "2025-04-30", description: "Deploy Splunk SOAR for automated response", progress: 50, programId: programMap["Security Operations Center"], estimatedBudget: "350000.00", actualBudget: "165000.00" },
        { title: "24x7 SOC Staffing", type: "KTLO", status: "In Progress", priority: "Critical", startDate: "2024-07-01", endDate: "2025-06-30", description: "Staff 24x7 security operations center coverage", progress: 50, programId: programMap["Security Operations Center"], estimatedBudget: "800000.00", actualBudget: "420000.00" },
      ];
      const insertedWorkItems = await Promise.all(workItemData.map(w => storage.createWorkItem(w)));
      const workItemMap = Object.fromEntries(insertedWorkItems.map(w => [w.title, w.id]));

      const currentWeek = "2025-12-08";
      const allocationData = [
        { resourceId: resourceMap["Ronald Bennett"], workItemId: workItemMap["Application Assessment Wave 1"], weekStartDate: currentWeek, hours: "20.00" },
        { resourceId: resourceMap["Helen Wood"], workItemId: workItemMap["Application Assessment Wave 1"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Scott Barnes"], workItemId: workItemMap["Database Migration - SQL Server"], weekStartDate: currentWeek, hours: "35.00" },
        { resourceId: resourceMap["Kimberly Ross"], workItemId: workItemMap["Kubernetes Platform Enhancement"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Marcus Johnson"], workItemId: workItemMap["Finance Module Go-Live"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["David Kim"], workItemId: workItemMap["Finance Module Go-Live"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Harold Stone"], workItemId: workItemMap["Identity Platform Upgrade"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Thomas Anderson"], workItemId: workItemMap["Snowflake Data Lake"], weekStartDate: currentWeek, hours: "35.00" },
        { resourceId: resourceMap["Elena Rodriguez"], workItemId: workItemMap["Salesforce CPQ Implementation"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Jennifer Walsh"], workItemId: workItemMap["Customer 360 Dashboard"], weekStartDate: currentWeek, hours: "35.00" },
        { resourceId: resourceMap["Philip Myers"], workItemId: workItemMap["Teams Phone System Rollout"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Lisa Patel"], workItemId: workItemMap["ServiceNow ITSM Upgrade"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Jean Alexander"], workItemId: workItemMap["Wireless Refresh"], weekStartDate: currentWeek, hours: "35.00" },
        { resourceId: resourceMap["Teresa Griffin"], workItemId: workItemMap["Wireless Refresh"], weekStartDate: currentWeek, hours: "35.00" },
        { resourceId: resourceMap["Donald Henderson"], workItemId: workItemMap["DC2 Server Migration"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Deborah Coleman"], workItemId: workItemMap["Storage Refresh"], weekStartDate: currentWeek, hours: "35.00" },
        { resourceId: resourceMap["Eugene Knight"], workItemId: workItemMap["24x7 SOC Staffing"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Gloria Black"], workItemId: workItemMap["24x7 SOC Staffing"], weekStartDate: currentWeek, hours: "40.00" },
        { resourceId: resourceMap["Anne Webb"], workItemId: workItemMap["SOAR Implementation"], weekStartDate: currentWeek, hours: "35.00" },
        { resourceId: resourceMap["Shawn Gardner"], workItemId: workItemMap["Security Patching"], weekStartDate: currentWeek, hours: "20.00" },
      ];
      await Promise.all(allocationData.map(a => storage.createAllocation(a)));

      res.json({
        success: true,
        message: "Production database seeded successfully!",
        summary: {
          departments: 2,
          teams: teams.length,
          resources: insertedResources.length,
          skills: 20,
          portfolios: insertedPortfolios.length,
          programs: insertedPrograms.length,
          workItems: insertedWorkItems.length,
          allocations: allocationData.length
        }
      });
    } catch (error: any) {
      console.error("Seed error:", error);
      res.status(500).json({ error: "Failed to seed database", details: error.message });
    }
  });

  return httpServer;
}
