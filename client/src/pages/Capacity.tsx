import Layout from "@/components/layout/Layout";
import { RESOURCES, ALLOCATIONS, WORK_ITEMS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addWeeks, startOfWeek } from "date-fns";

export default function Capacity() {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weeks = Array.from({ length: 12 }).map((_, i) => {
    const date = addWeeks(startDate, i);
    return {
      label: format(date, "MMM d"),
      date: format(date, "yyyy-MM-dd"),
      fullDate: date
    };
  });

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Capacity Planning</h1>
          <p className="text-slate-500 dark:text-slate-400">Forecast resource needs and manage allocations.</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="q1">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1">Q1 2025</SelectItem>
              <SelectItem value="q2">Q2 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-sm text-slate-700">
              {weeks[0].label} - {weeks[weeks.length - 1].label}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-indigo-200 rounded-sm"></div>
              <span>Allocated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-200 rounded-sm"></div>
              <span>Overbooked</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-r border-slate-200 bg-slate-50 min-w-[250px] sticky left-0 z-10">Resource</th>
                {weeks.map(week => (
                  <th key={week.label} className="p-2 border-b border-slate-200 bg-slate-50 min-w-[80px] text-center font-medium text-slate-600">
                    {week.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RESOURCES.map(resource => {
                // Get allocations for this resource
                const resourceAllocations = ALLOCATIONS.filter(a => a.resourceId === resource.id);
                
                return (
                  <tr key={resource.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 border-b border-r border-slate-200 bg-white group-hover:bg-slate-50/50 sticky left-0 z-10">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">{resource.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">{resource.name}</div>
                          <div className="text-xs text-slate-500">{resource.role}</div>
                        </div>
                      </div>
                    </td>
                    {weeks.map(week => {
                      // Calculate total hours allocated for this week
                      // Note: In a real app we'd match exact dates, here we just use the mock data logic roughly
                      const weeklyAllocation = resourceAllocations.reduce((acc, a) => {
                        // Very rough mock logic: if allocation week starts same as this week column
                        // For demo, let's just use the first allocation found or random to fill grid
                        return acc + (a.weekStartDate === week.date ? a.hours : 0);
                      }, 0);

                      // Force some visual data for the grid based on the "static" allocations in data.ts
                      // If the resource has ANY allocation, let's just spread it across weeks for the visual mockup
                      const hasAllocation = resourceAllocations.length > 0;
                      const hours = hasAllocation ? resourceAllocations[0].hours : 0;
                      
                      const utilization = (hours / resource.capacity) * 100;
                      
                      let bgClass = "bg-white";
                      if (utilization === 0) bgClass = "bg-white";
                      else if (utilization <= 50) bgClass = "bg-green-50";
                      else if (utilization <= 80) bgClass = "bg-indigo-50";
                      else if (utilization <= 100) bgClass = "bg-blue-100";
                      else bgClass = "bg-red-100";

                      let textClass = "text-slate-400";
                      if (utilization > 100) textClass = "text-red-700 font-bold";
                      else if (utilization > 0) textClass = "text-slate-700 font-medium";

                      return (
                        <td key={week.label} className={cn("p-2 border-b border-slate-200 text-center border-r border-slate-100", bgClass)}>
                          <span className={textClass}>{hours > 0 ? hours : "-"}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}