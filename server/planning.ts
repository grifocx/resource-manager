import { db } from "./db";
import { allocations, resources, skills, resourceSkills, workItems, workItemSkills } from "@shared/schema";
import { eq, inArray, and, gte, lte, sql } from "drizzle-orm";
import { addWeeks, differenceInWeeks, startOfWeek, parseISO } from "date-fns";

/**
 * Calculate net availability for a resource over a period.
 * Returns the average weekly hours available.
 */
export async function calculateNetAvailability(resourceId: number, startDate: Date, endDate: Date) {
  // Get all allocations for this resource in the date range
  const resourceAllocations = await db.select()
    .from(allocations)
    .where(
      and(
        eq(allocations.resourceId, resourceId),
        gte(allocations.weekStartDate, startDate.toISOString().split('T')[0]),
        lte(allocations.weekStartDate, endDate.toISOString().split('T')[0])
      )
    );

  // Get resource capacity
  const resource = await db.query.resources.findFirst({
    where: eq(resources.id, resourceId)
  });

  if (!resource) return 0;

  const capacity = resource.capacity;
  const numWeeks = Math.max(1, differenceInWeeks(endDate, startDate));

  // Sum allocated hours
  const totalAllocated = resourceAllocations.reduce((sum, alloc) => sum + Number(alloc.hours), 0);

  // Average allocated per week
  const avgAllocated = totalAllocated / numWeeks;

  return Math.max(0, capacity - avgAllocated);
}

/**
 * Score resources for a work item based on skills and availability.
 */
export async function suggestResources(workItemId: number) {
  // 1. Get Work Item Requirements
  const workItem = await db.query.workItems.findFirst({
    where: eq(workItems.id, workItemId),
    with: {
      program: true
    }
  });

  if (!workItem) throw new Error("Work Item not found");

  // Get required skills
  const requiredSkills = await db.select({
    skillId: workItemSkills.skillId,
    level: workItemSkills.levelRequired
  })
  .from(workItemSkills)
  .where(eq(workItemSkills.workItemId, workItemId));

  const requiredSkillIds = requiredSkills.map(s => s.skillId);

  // 2. Get All Resources with their Skills
  const allResources = await db.query.resources.findMany({
    with: {
      team: true
    }
  });

  const scores = [];

  for (const resource of allResources) {
    // A. Skill Score
    const resSkills = await db.select().from(resourceSkills).where(eq(resourceSkills.resourceId, resource.id));
    const resSkillIds = resSkills.map(s => s.skillId);

    let skillMatchCount = 0;
    if (requiredSkillIds.length > 0) {
      skillMatchCount = requiredSkillIds.filter(id => resSkillIds.includes(id)).length;
    }

    const skillScore = requiredSkillIds.length > 0
      ? (skillMatchCount / requiredSkillIds.length) * 100
      : 100; // If no skills required, everyone matches on skills

    // B. Availability Score
    const startDate = new Date(workItem.startDate);
    const endDate = new Date(workItem.endDate);
    const netAvail = await calculateNetAvailability(resource.id, startDate, endDate);

    // Availability score: 100 if > 20h available, linear drop to 0
    const availabilityScore = Math.min(100, (netAvail / 20) * 100);

    // C. Total Score (Weighted)
    // 60% Skills, 40% Availability
    const totalScore = (skillScore * 0.6) + (availabilityScore * 0.4);

    scores.push({
      resource,
      skillScore,
      availabilityScore,
      netAvailability: netAvail,
      totalScore
    });
  }

  // Sort by Total Score descending
  return scores.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Auto-allocate hours for a work item.
 */
export async function autoAllocate(resourceId: number, workItemId: number, totalHours: number) {
  const workItem = await db.query.workItems.findFirst({
    where: eq(workItems.id, workItemId)
  });
  if (!workItem) throw new Error("Work Item not found");

  const start = startOfWeek(new Date(workItem.startDate), { weekStartsOn: 1 });
  const end = new Date(workItem.endDate);

  const numWeeks = Math.max(1, differenceInWeeks(end, start));
  const hoursPerWeek = (totalHours / numWeeks).toFixed(2);

  // Create allocations for each week
  const allocationsToInsert = [];
  for (let i = 0; i < numWeeks; i++) {
    const weekDate = addWeeks(start, i);
    allocationsToInsert.push({
      resourceId,
      workItemId,
      weekStartDate: weekDate.toISOString().split('T')[0],
      hours: hoursPerWeek.toString()
    });
  }

  // Transaction: Delete existing allocations for this pair within range (optional) and insert new
  // For now, just insert.
  // Note: In a real app, we might want to be careful about overwriting.

  await db.delete(allocations)
    .where(and(
      eq(allocations.resourceId, resourceId),
      eq(allocations.workItemId, workItemId)
    ));

  await db.insert(allocations).values(allocationsToInsert);

  return allocationsToInsert;
}

/**
 * Shifts existing allocations when a work item's dates change.
 * Maintains the total allocated hours per resource but spreads them over the new duration.
 */
export async function shiftAllocations(workItemId: number) {
  const workItem = await db.query.workItems.findFirst({
    where: eq(workItems.id, workItemId)
  });
  if (!workItem) return;

  const start = startOfWeek(new Date(workItem.startDate), { weekStartsOn: 1 });
  const end = new Date(workItem.endDate);
  const numWeeks = Math.max(1, differenceInWeeks(end, start));

  // Get all allocations for this work item, grouped by resource
  const currentAllocations = await db.select().from(allocations).where(eq(allocations.workItemId, workItemId));

  // Group by resource
  const resourceTotals: Record<number, number> = {};
  currentAllocations.forEach(a => {
    if (!resourceTotals[a.resourceId]) resourceTotals[a.resourceId] = 0;
    resourceTotals[a.resourceId] += parseFloat(a.hours);
  });

  // For each resource, re-allocate their total hours over the new period
  for (const [resourceIdStr, totalHours] of Object.entries(resourceTotals)) {
    const resourceId = parseInt(resourceIdStr);
    const hoursPerWeek = (totalHours / numWeeks).toFixed(2);

    // Delete old
    await db.delete(allocations).where(and(
      eq(allocations.workItemId, workItemId),
      eq(allocations.resourceId, resourceId)
    ));

    // Insert new
    const newAllocations = [];
    for (let i = 0; i < numWeeks; i++) {
      const weekDate = addWeeks(start, i);
      newAllocations.push({
        resourceId,
        workItemId,
        weekStartDate: weekDate.toISOString().split('T')[0],
        hours: hoursPerWeek.toString()
      });
    }

    if (newAllocations.length > 0) {
      await db.insert(allocations).values(newAllocations);
    }
  }
}
