import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  AlertCircle,
  Clock,
  Loader2
} from "lucide-react";
import { useTeams, useResources, useWorkItems, useAllocations, getTeamName } from "@/lib/queries";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { WorkItemEditDialog } from "@/components/WorkItemEditDialog";
import type { WorkItem } from "@shared/schema";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [editingWorkItem, setEditingWorkItem] = useState<WorkItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { data: resources = [], isLoading: resourcesLoading } = useResources();
  const { data: workItems = [], isLoading: workItemsLoading } = useWorkItems();
  const { data: allocations = [], isLoading: allocationsLoading } = useAllocations();

  const isLoading = teamsLoading || resourcesLoading || workItemsLoading || allocationsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </Layout>
    );
  }

  const totalCapacity = resources.reduce((acc, r) => acc + r.capacity, 0);
  const totalAllocated = allocations.reduce((acc, a) => acc + parseFloat(a.hours), 0);
  const utilization = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;
  
  const activeProjects = workItems.filter(w => w.status === "In Progress" && w.type === "Project").length;
  const criticalItems = workItems.filter(w => w.priority === "Critical").length;

  const allocationByTeam = teams.map(team => {
    const teamResources = resources.filter(r => r.teamId === team.id);
    const teamAllocated = allocations
      .filter(a => teamResources.some(r => r.id === a.resourceId))
      .reduce((acc, a) => acc + parseFloat(a.hours), 0);
    const teamCapacity = teamResources.reduce((acc, r) => acc + r.capacity, 0);
    
    return {
      name: team.name,
      allocated: teamAllocated,
      capacity: teamCapacity,
      utilization: teamCapacity > 0 ? Math.round((teamAllocated / teamCapacity) * 100) : 0
    };
  });

  const statusDistribution = [
    { name: "In Progress", value: workItems.filter(w => w.status === "In Progress").length, color: "#6366f1" },
    { name: "New", value: workItems.filter(w => w.status === "New").length, color: "#3b82f6" },
    { name: "Analysis", value: workItems.filter(w => w.status === "Analysis").length, color: "#a855f7" },
    { name: "Approved", value: workItems.filter(w => w.status === "Approved").length, color: "#22c55e" },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of resource utilization and work item status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="shadow-sm border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all" 
          data-testid="card-utilization"
          onClick={() => navigate("/capacity")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-utilization-percent">{utilization}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {totalAllocated} / {totalCapacity} hours allocated
            </p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all" 
                style={{ width: `${Math.min(utilization, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all" 
          data-testid="card-active-projects"
          onClick={() => navigate("/work?tab=projects&status=In+Progress")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-projects">{activeProjects}</div>
            <p className="text-xs text-slate-500 mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all" 
          data-testid="card-team-members"
          onClick={() => navigate("/resources")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-team-members">{resources.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              Across {teams.length} teams
            </p>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all" 
          data-testid="card-critical-items"
          onClick={() => navigate("/work?priority=Critical")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="text-critical-items">{criticalItems}</div>
            <p className="text-xs text-slate-500 mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Team Utilization</CardTitle>
            <CardDescription>Capacity vs Allocation by Team</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {allocationByTeam.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allocationByTeam} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="capacity" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={20} stackId="a" />
                  <Bar dataKey="allocated" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} stackId="b" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                No teams created yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Work Distribution</CardTitle>
            <CardDescription>Work items by Status</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {workItems.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                No work items created yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Recent Work Items</CardTitle>
          <CardDescription>Latest projects and demands tracked in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {workItems.length > 0 ? (
            <div className="space-y-4">
              {workItems.slice(0, 5).map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all" 
                  data-testid={`card-work-item-${item.id}`}
                  onClick={() => {
                    setEditingWorkItem(item);
                    setEditDialogOpen(true);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      item.type === "Project" ? "bg-indigo-100 text-indigo-600" :
                      item.type === "Demand" ? "bg-purple-100 text-purple-600" :
                      "bg-orange-100 text-orange-600"
                    )}>
                      {item.type === "Project" && <Briefcase className="h-4 w-4" />}
                      {item.type === "Demand" && <TrendingUp className="h-4 w-4" />}
                      {item.type === "KTLO" && <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{item.status}</div>
                      <div className="text-xs text-slate-500">{item.startDate}</div>
                    </div>
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      item.status === "In Progress" ? "bg-green-500" :
                      item.status === "New" ? "bg-blue-500" :
                      "bg-gray-300"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No work items yet. Create your first work item to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <WorkItemEditDialog 
        workItem={editingWorkItem} 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
      />
    </Layout>
  );
}
