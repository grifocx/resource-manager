import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { useResources, useAllocations, useWorkItems, useCreateAllocation } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addWeeks, startOfWeek } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Capacity() {
  const { data: resources = [], isLoading: resourcesLoading } = useResources();
  const { data: allocations = [], isLoading: allocationsLoading } = useAllocations();
  const { data: workItems = [], isLoading: workItemsLoading } = useWorkItems();
  const createAllocation = useCreateAllocation();
  const { toast } = useToast();

  const [weekOffset, setWeekOffset] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    resourceId: "",
    workItemId: "",
    weekStartDate: "",
    hours: "8",
  });

  const isLoading = resourcesLoading || allocationsLoading || workItemsLoading;

  const baseDate = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
  const weeks = Array.from({ length: 12 }).map((_, i) => {
    const date = addWeeks(baseDate, i);
    return {
      label: format(date, "MMM d"),
      date: format(date, "yyyy-MM-dd"),
      fullDate: date
    };
  });

  const workItemMap = useMemo(() => {
    return new Map(workItems.map(w => [w.id, w]));
  }, [workItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resourceId || !formData.workItemId || !formData.weekStartDate || !formData.hours) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    
    try {
      await createAllocation.mutateAsync({
        resourceId: parseInt(formData.resourceId),
        workItemId: parseInt(formData.workItemId),
        weekStartDate: formData.weekStartDate,
        hours: parseFloat(formData.hours).toString(),
      });
      toast({ title: "Success", description: "Allocation created successfully" });
      setDialogOpen(false);
      setFormData({ resourceId: "", workItemId: "", weekStartDate: "", hours: "8" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create allocation", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Capacity Planning</h1>
          <p className="text-slate-500 dark:text-slate-400">Forecast resource needs and manage allocations.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" data-testid="button-add-allocation">
                <Plus className="h-4 w-4 mr-2" />
                Add Allocation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Allocation</DialogTitle>
                <DialogDescription>
                  Assign hours for a resource to a work item.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="resource">Resource</Label>
                    <Select value={formData.resourceId} onValueChange={(v) => setFormData({ ...formData, resourceId: v })}>
                      <SelectTrigger data-testid="select-allocation-resource">
                        <SelectValue placeholder="Select resource" />
                      </SelectTrigger>
                      <SelectContent>
                        {resources.map((r) => (
                          <SelectItem key={r.id} value={r.id.toString()}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="workItem">Work Item</Label>
                    <Select value={formData.workItemId} onValueChange={(v) => setFormData({ ...formData, workItemId: v })}>
                      <SelectTrigger data-testid="select-allocation-work-item">
                        <SelectValue placeholder="Select work item" />
                      </SelectTrigger>
                      <SelectContent>
                        {workItems.map((w) => (
                          <SelectItem key={w.id} value={w.id.toString()}>
                            {w.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weekStart">Week Starting</Label>
                    <Input
                      id="weekStart"
                      type="date"
                      value={formData.weekStartDate}
                      onChange={(e) => setFormData({ ...formData, weekStartDate: e.target.value })}
                      data-testid="input-allocation-week"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      data-testid="input-allocation-hours"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createAllocation.isPending} data-testid="button-submit-allocation">
                    {createAllocation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Allocation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setWeekOffset(prev => prev - 4)}
              data-testid="button-prev-weeks"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-sm text-slate-700">
              {weeks[0].label} - {weeks[weeks.length - 1].label}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setWeekOffset(prev => prev + 4)}
              data-testid="button-next-weeks"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-slate-300 rounded-sm"></div>
              <span>KTLO/Admin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
              <span>Project Work</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span>Overbooked</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {resources.length > 0 ? (
            <TooltipProvider>
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
                  {resources.map(resource => {
                    const resourceAllocations = allocations.filter(a => a.resourceId === resource.id);

                    return (
                      <tr key={resource.id} className="group hover:bg-slate-50/50 transition-colors" data-testid={`row-capacity-${resource.id}`}>
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
                          const weeklyAllocs = resourceAllocations.filter(a => a.weekStartDate === week.date);

                          let baseline = 0;
                          let project = 0;

                          weeklyAllocs.forEach(a => {
                            const hours = parseFloat(a.hours);
                            const w = workItemMap.get(a.workItemId);
                            if (w?.type === 'KTLO') {
                              baseline += hours;
                            } else {
                              project += hours;
                            }
                          });

                          const total = baseline + project;
                          const capacity = resource.capacity || 40;
                          const isOverbooked = total > capacity;
                          const netAvailable = Math.max(0, capacity - baseline - project);
                          const utilization = capacity > 0 ? (total / capacity) * 100 : 0;

                          // Dynamic styles
                          let bgClass = "bg-white";
                          if (isOverbooked) bgClass = "bg-red-50";
                          else if (utilization > 0) bgClass = "bg-slate-50/30";

                          return (
                            <Tooltip key={week.label}>
                              <TooltipTrigger asChild>
                                <td className={cn("p-2 border-b border-slate-200 border-r border-slate-100 relative h-12 align-bottom pb-0", bgClass)}>
                                  {total > 0 && (
                                    <div className="flex flex-col justify-end h-full w-full gap-0.5 px-2 pb-2">
                                       {/* Visualization Bar */}
                                      <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-slate-100">
                                        {baseline > 0 && (
                                          <div
                                            className="bg-slate-400 h-full"
                                            style={{ width: `${Math.min(100, (baseline / capacity) * 100)}%` }}
                                          />
                                        )}
                                        {project > 0 && (
                                          <div
                                            className={cn("h-full", isOverbooked ? "bg-red-500" : "bg-indigo-500")}
                                            style={{ width: `${Math.min(100, (project / capacity) * 100)}%` }}
                                          />
                                        )}
                                      </div>

                                      <div className="flex justify-between items-end">
                                        <span className={cn("text-xs font-medium", isOverbooked ? "text-red-600" : "text-slate-700")}>
                                          {total}h
                                        </span>
                                        {isOverbooked && <AlertTriangle className="h-3 w-3 text-red-500" />}
                                      </div>
                                    </div>
                                  )}
                                  {total === 0 && <span className="text-slate-300 text-xs block text-center py-3">-</span>}
                                </td>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs space-y-1">
                                  <div className="font-bold">{week.label}</div>
                                  <div className="flex justify-between gap-4"><span className="text-slate-500">Capacity:</span> <span>{capacity}h</span></div>
                                  <div className="flex justify-between gap-4"><span className="text-slate-500">KTLO/Admin:</span> <span>{baseline}h</span></div>
                                  <div className="flex justify-between gap-4"><span className="text-slate-500">Projects:</span> <span>{project}h</span></div>
                                  <div className="border-t pt-1 mt-1 flex justify-between gap-4 font-medium">
                                    <span>Net Available:</span>
                                    <span className={netAvailable === 0 ? "text-red-500" : "text-green-600"}>{netAvailable}h</span>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TooltipProvider>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No resources yet. Add resources first to see capacity planning.
            </div>
          )}
        </div>
      </Card>
    </Layout>
  );
}
