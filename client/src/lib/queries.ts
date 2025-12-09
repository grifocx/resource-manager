import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import type { 
  Team, Resource, WorkItem, Allocation, Skill, Department, Portfolio, Program,
  InsertTeam, InsertResource, InsertWorkItem, InsertAllocation, InsertSkill, 
  InsertDepartment, InsertPortfolio, InsertProgram 
} from "@shared/schema";

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });
}

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });
}

export function useResources() {
  return useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });
}

export function useWorkItems() {
  return useQuery<WorkItem[]>({
    queryKey: ["/api/work-items"],
  });
}

export function useAllocations() {
  return useQuery<Allocation[]>({
    queryKey: ["/api/allocations"],
  });
}

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });
}

export function usePortfolios() {
  return useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
  });
}

export function usePrograms() {
  return useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDepartment) => {
      const res = await apiRequest("POST", "/api/departments", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
    },
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTeam) => {
      const res = await apiRequest("POST", "/api/teams", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    },
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertResource) => {
      const res = await apiRequest("POST", "/api/resources", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
    },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertResource> }) => {
      const res = await apiRequest("PATCH", `/api/resources/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
    },
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPortfolio) => {
      const res = await apiRequest("POST", "/api/portfolios", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/portfolios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
    },
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProgram) => {
      const res = await apiRequest("POST", "/api/programs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/programs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
    },
  });
}

export function useCreateWorkItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertWorkItem) => {
      const res = await apiRequest("POST", "/api/work-items", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-items"] });
    },
  });
}

export function useUpdateWorkItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertWorkItem> }) => {
      const res = await apiRequest("PATCH", `/api/work-items/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-items"] });
    },
  });
}

export function useDeleteWorkItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/work-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-items"] });
    },
  });
}

export function useCreateAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAllocation) => {
      const res = await apiRequest("POST", "/api/allocations", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/allocations"] });
    },
  });
}

export function useUpdateAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAllocation> }) => {
      const res = await apiRequest("PATCH", `/api/allocations/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/allocations"] });
    },
  });
}

export function useDeleteAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/allocations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/allocations"] });
    },
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSkill) => {
      const res = await apiRequest("POST", "/api/skills", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
  });
}

export function getTeamName(teams: Team[], teamId: number): string {
  return teams.find((t) => t.id === teamId)?.name || "Unknown Team";
}

export function getTeamColor(teams: Team[], teamId: number): string {
  return teams.find((t) => t.id === teamId)?.color || "bg-gray-500";
}

export function getDepartmentName(departments: Department[], departmentId: number | null): string {
  if (!departmentId) return "Unassigned";
  return departments.find((d) => d.id === departmentId)?.name || "Unknown Department";
}

export function getPortfolioName(portfolios: Portfolio[], portfolioId: number | null): string {
  if (!portfolioId) return "Unassigned";
  return portfolios.find((p) => p.id === portfolioId)?.name || "Unknown Portfolio";
}

export function getProgramName(programs: Program[], programId: number | null): string {
  if (!programId) return "Unassigned";
  return programs.find((p) => p.id === programId)?.name || "Unknown Program";
}
