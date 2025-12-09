import { addDays, startOfWeek, format } from "date-fns";

export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  name: string;
  role: string;
  teamId: string;
  skills: string[];
  capacity: number; // hours per week
  avatar: string;
  email: string;
}

export type WorkItemType = "Project" | "Demand" | "KTLO";
export type WorkItemStatus = "New" | "Analysis" | "Approved" | "In Progress" | "Completed" | "On Hold";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface WorkItem {
  id: string;
  title: string;
  type: WorkItemType;
  status: WorkItemStatus;
  priority: Priority;
  startDate: string;
  endDate: string;
  description: string;
  progress: number;
}

export interface Allocation {
  id: string;
  resourceId: string;
  workItemId: string;
  weekStartDate: string; // YYYY-MM-DD
  hours: number;
}

// Mock Data

export const TEAMS: Team[] = [
  { id: "t1", name: "Platform Engineering", color: "bg-blue-500" },
  { id: "t2", name: "Product Design", color: "bg-purple-500" },
  { id: "t3", name: "Data Science", color: "bg-teal-500" },
  { id: "t4", name: "Mobile App", color: "bg-orange-500" },
];

export const RESOURCES: Resource[] = [
  { id: "r1", name: "Sarah Chen", role: "Senior Engineer", teamId: "t1", skills: ["React", "Node.js", "AWS"], capacity: 40, avatar: "SC", email: "sarah.chen@nexus.co" },
  { id: "r2", name: "Marcus Johnson", role: "Tech Lead", teamId: "t1", skills: ["Architecture", "Go", "Kubernetes"], capacity: 40, avatar: "MJ", email: "marcus.j@nexus.co" },
  { id: "r3", name: "Elena Rodriguez", role: "Product Designer", teamId: "t2", skills: ["Figma", "UX Research", "Prototyping"], capacity: 40, avatar: "ER", email: "elena.r@nexus.co" },
  { id: "r4", name: "David Kim", role: "Data Engineer", teamId: "t3", skills: ["Python", "Spark", "SQL"], capacity: 40, avatar: "DK", email: "david.k@nexus.co" },
  { id: "r5", name: "Jessica Wu", role: "Frontend Dev", teamId: "t4", skills: ["React Native", "TypeScript"], capacity: 40, avatar: "JW", email: "jessica.w@nexus.co" },
  { id: "r6", name: "Tom Baker", role: "DevOps Engineer", teamId: "t1", skills: ["Terraform", "CI/CD"], capacity: 40, avatar: "TB", email: "tom.b@nexus.co" },
];

export const WORK_ITEMS: WorkItem[] = [
  { id: "w1", title: "Cloud Migration Phase 2", type: "Project", status: "In Progress", priority: "High", startDate: "2025-01-15", endDate: "2025-06-30", description: "Migrating remaining legacy services to AWS EKS.", progress: 45 },
  { id: "w2", title: "Q3 Design System Update", type: "Project", status: "Approved", priority: "Medium", startDate: "2025-04-01", endDate: "2025-05-30", description: "Refreshing component library with new brand guidelines.", progress: 10 },
  { id: "w3", title: "Data Pipeline Optimization", type: "Demand", status: "Analysis", priority: "High", startDate: "2025-05-01", endDate: "2025-06-15", description: "Improving ETL performance for nightly batches.", progress: 0 },
  { id: "w4", title: "Mobile App Dark Mode", type: "Project", status: "In Progress", priority: "Medium", startDate: "2025-02-01", endDate: "2025-04-15", description: "Implementing comprehensive dark mode support.", progress: 75 },
  { id: "w5", title: "Security Patching", type: "KTLO", status: "In Progress", priority: "Critical", startDate: "2025-01-01", endDate: "2025-12-31", description: "Ongoing security maintenance and updates.", progress: 30 },
  { id: "w6", title: "Customer Portal Redesign", type: "Demand", status: "New", priority: "Low", startDate: "2025-07-01", endDate: "2025-09-30", description: "Proposed overhaul of the customer facing portal.", progress: 0 },
];

// Generate some allocations
const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
export const ALLOCATIONS: Allocation[] = [
  // Sarah on Cloud Migration
  { id: "a1", resourceId: "r1", workItemId: "w1", weekStartDate: format(currentWeekStart, "yyyy-MM-dd"), hours: 20 },
  { id: "a2", resourceId: "r1", workItemId: "w5", weekStartDate: format(currentWeekStart, "yyyy-MM-dd"), hours: 10 },
  
  // Marcus on Cloud Migration
  { id: "a3", resourceId: "r2", workItemId: "w1", weekStartDate: format(currentWeekStart, "yyyy-MM-dd"), hours: 30 },
  
  // Elena on Design System
  { id: "a4", resourceId: "r3", workItemId: "w2", weekStartDate: format(currentWeekStart, "yyyy-MM-dd"), hours: 35 },
  
  // Jessica on Mobile App
  { id: "a5", resourceId: "r5", workItemId: "w4", weekStartDate: format(currentWeekStart, "yyyy-MM-dd"), hours: 40 },
];

export const getTeamName = (teamId: string) => TEAMS.find(t => t.id === teamId)?.name || "Unknown Team";
export const getTeamColor = (teamId: string) => TEAMS.find(t => t.id === teamId)?.color || "bg-gray-500";
