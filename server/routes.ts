import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertTeamSchema,
  insertResourceSchema,
  insertSkillSchema,
  insertWorkItemSchema,
  insertAllocationSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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

  return httpServer;
}
