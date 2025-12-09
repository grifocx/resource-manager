import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { useUpdateWorkItem, usePrograms } from "@/lib/queries";
import { useToast } from "@/hooks/use-toast";
import type { WorkItem } from "@shared/schema";

interface WorkItemEditDialogProps {
  workItem: WorkItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkItemEditDialog({ workItem, open, onOpenChange }: WorkItemEditDialogProps) {
  const updateWorkItem = useUpdateWorkItem();
  const { data: programs = [] } = usePrograms();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    type: "Project",
    status: "New",
    priority: "Medium",
    startDate: "",
    endDate: "",
    description: "",
    progress: 0,
    programId: "none",
  });

  useEffect(() => {
    if (workItem) {
      setFormData({
        title: workItem.title,
        type: workItem.type,
        status: workItem.status,
        priority: workItem.priority,
        startDate: workItem.startDate,
        endDate: workItem.endDate,
        description: workItem.description,
        progress: workItem.progress,
        programId: workItem.programId?.toString() || "none",
      });
    }
  }, [workItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workItem) return;

    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      await updateWorkItem.mutateAsync({
        id: workItem.id,
        data: {
          title: formData.title,
          type: formData.type,
          status: formData.status,
          priority: formData.priority,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description,
          progress: formData.progress,
          programId: formData.programId && formData.programId !== "none" ? parseInt(formData.programId) : null,
        },
      });
      toast({ title: "Success", description: "Work item updated successfully" });
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update work item", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Work Item</DialogTitle>
          <DialogDescription>
            Update the work item details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Work item title"
                data-testid="input-edit-workitem-title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-program">Program (Optional)</Label>
              <Select value={formData.programId} onValueChange={(v) => setFormData({ ...formData, programId: v })}>
                <SelectTrigger data-testid="select-edit-workitem-program">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Program</SelectItem>
                  {programs.map(program => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger data-testid="select-edit-workitem-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Demand">Demand</SelectItem>
                    <SelectItem value="KTLO">KTLO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger data-testid="select-edit-workitem-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Analysis">Analysis</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                <SelectTrigger data-testid="select-edit-workitem-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  data-testid="input-edit-workitem-start-date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  data-testid="input-edit-workitem-end-date"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the work item..."
                data-testid="input-edit-workitem-description"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-progress">Progress</Label>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{formData.progress}%</span>
              </div>
              <Slider
                id="edit-progress"
                value={[formData.progress]}
                onValueChange={(v) => setFormData({ ...formData, progress: v[0] })}
                max={100}
                step={5}
                className="py-2"
                data-testid="slider-edit-workitem-progress"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateWorkItem.isPending} data-testid="button-save-workitem">
              {updateWorkItem.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
