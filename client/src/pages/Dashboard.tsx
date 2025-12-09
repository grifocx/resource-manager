import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle2
} from "lucide-react";
import { TEAMS, RESOURCES, WORK_ITEMS, ALLOCATIONS } from "@/lib/data";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const totalCapacity = RESOURCES.reduce((acc, r) => acc + r.capacity, 0);
  const totalAllocated = ALLOCATIONS.reduce((acc, a) => acc + a.hours, 0);
  const utilization = Math.round((totalAllocated / totalCapacity) * 100);
  
  const activeProjects = WORK_ITEMS.filter(w => w.status === "In Progress" && w.type === "Project").length;
  const criticalItems = WORK_ITEMS.filter(w => w.priority === "Critical").length;

  // Chart Data Preparation
  const allocationByTeam = TEAMS.map(team => {
    const teamResources = RESOURCES.filter(r => r.teamId === team.id);
    const teamAllocated = ALLOCATIONS
      .filter(a => teamResources.some(r => r.id === a.resourceId))
      .reduce((acc, a) => acc + a.hours, 0);
    const teamCapacity = teamResources.reduce((acc, r) => acc + r.capacity, 0);
    
    return {
      name: team.name,
      allocated: teamAllocated,
      capacity: teamCapacity,
      utilization: Math.round((teamAllocated / teamCapacity) * 100) || 0
    };
  });

  const statusDistribution = [
    { name: "In Progress", value: WORK_ITEMS.filter(w => w.status === "In Progress").length, color: "#6366f1" },
    { name: "New", value: WORK_ITEMS.filter(w => w.status === "New").length, color: "#3b82f6" },
    { name: "Analysis", value: WORK_ITEMS.filter(w => w.status === "Analysis").length, color: "#a855f7" },
    { name: "Approved", value: WORK_ITEMS.filter(w => w.status === "Approved").length, color: "#22c55e" },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of resource utilization and work item status.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilization}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {totalAllocated} / {totalCapacity} hours allocated
            </p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all" 
                style={{ width: `${utilization}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-slate-500 mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{RESOURCES.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              Across {TEAMS.length} teams
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
            <p className="text-xs text-slate-500 mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Team Utilization</CardTitle>
            <CardDescription>Capacity vs Allocation by Team</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
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
                {/* Note: In a real chart, we'd overlap bars properly, here using stack for simplicity of visualization or separate bars */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Work Distribution</CardTitle>
            <CardDescription>Work items by Status</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
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
          </CardContent>
        </Card>
      </div>

      {/* Recent Items */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Recent Work Items</CardTitle>
          <CardDescription>Latest projects and demands tracked in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {WORK_ITEMS.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
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
        </CardContent>
      </Card>
    </Layout>
  );
}