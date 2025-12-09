import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useResources, useAllocations, useWorkItems, useCreateAllocation } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Download, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addWeeks, startOfWeek, subWeeks } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
          {resources.length > 0 ? (
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
                        const weeklyHours = resourceAllocations
                          .filter(a => a.weekStartDate === week.date)
                          .reduce((acc, a) => acc + parseFloat(a.hours), 0);

                        const utilization = resource.capacity > 0 ? (weeklyHours / resource.capacity) * 100 : 0;
                        
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
                            <span className={textClass}>{weeklyHours > 0 ? weeklyHours : "-"}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
