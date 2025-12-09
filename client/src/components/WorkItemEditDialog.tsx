import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, X, BrainCircuit, UserCheck, CalendarClock } from "lucide-react";
import {
  useUpdateWorkItem,
  usePrograms,
  useSkills,
  useWorkItemSkills,
  useAddWorkItemSkill,
  useRemoveWorkItemSkill,
  useSuggestResources,
  useAllocateResources,
  type ResourceSuggestion
} from "@/lib/queries";
import { useToast } from "@/hooks/use-toast";
import type { WorkItem } from "@shared/schema";
import { cn } from "@/lib/utils";

interface WorkItemEditDialogProps {
  workItem: WorkItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkItemEditDialog({ workItem, open, onOpenChange }: WorkItemEditDialogProps) {
  const updateWorkItem = useUpdateWorkItem();
  const { data: programs = [] } = usePrograms();
  const { data: allSkills = [] } = useSkills();
  const { data: currentSkills = [] } = useWorkItemSkills(workItem?.id || 0);
  const addSkill = useAddWorkItemSkill();
  const removeSkill = useRemoveWorkItemSkill();
  const suggestResources = useSuggestResources();
  const allocateResources = useAllocateResources();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("details");
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
    estimatedHours: "",
  });

  const [suggestions, setSuggestions] = useState<ResourceSuggestion[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");

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
        estimatedHours: workItem.estimatedHours?.toString() || "",
      });
      setSuggestions([]); // Reset suggestions on open
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
          estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
        },
      });
      toast({ title: "Success", description: "Work item updated successfully" });
      // Don't close immediately if on planning tab, maybe user wants to save edits before planning
      if (activeTab === "details") {
        onOpenChange(false);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update work item", variant: "destructive" });
    }
  };

  const handleAddSkill = async () => {
    if (!workItem || !selectedSkillId) return;
    try {
      await addSkill.mutateAsync({ workItemId: workItem.id, skillId: parseInt(selectedSkillId) });
      setSelectedSkillId("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to add skill", variant: "destructive" });
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    if (!workItem) return;
    try {
      await removeSkill.mutateAsync({ workItemId: workItem.id, skillId });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove skill", variant: "destructive" });
    }
  };

  const handleSuggest = async () => {
    if (!workItem) return;
    try {
      // First save any pending changes to estimated hours etc
      await handleSubmit({ preventDefault: () => {} } as React.FormEvent);

      const results = await suggestResources.mutateAsync({ workItemId: workItem.id });
      setSuggestions(results);
    } catch (error) {
      toast({ title: "Error", description: "Failed to get suggestions", variant: "destructive" });
    }
  };

  const handleAllocate = async (resourceId: number) => {
    if (!workItem || !formData.estimatedHours) {
      toast({ title: "Error", description: "Please set Estimated Hours first", variant: "destructive" });
      return;
    }

    try {
      await allocateResources.mutateAsync({
        resourceId,
        workItemId: workItem.id,
        totalHours: parseInt(formData.estimatedHours)
      });
      toast({ title: "Success", description: "Resource allocated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to allocate resource", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Work Item</DialogTitle>
          <DialogDescription>
            Update details and manage resource planning.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="planning">Resource Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Work item title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-program">Program (Optional)</Label>
                  <Select value={formData.programId} onValueChange={(v) => setFormData({ ...formData, programId: v })}>
                    <SelectTrigger>
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
                      <SelectTrigger>
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
                      <SelectTrigger>
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
                    <SelectTrigger>
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
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateWorkItem.isPending}>
                  {updateWorkItem.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6 py-4">
            {/* Effort Estimation */}
            <div className="grid gap-2">
              <Label htmlFor="estimated-hours">Total Estimated Effort (Hours)</Label>
              <div className="flex gap-2">
                <Input
                  id="estimated-hours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  placeholder="e.g. 120"
                  className="max-w-[200px]"
                />
                <Button variant="secondary" onClick={handleSubmit} disabled={updateWorkItem.isPending}>
                  Save Estimate
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                This effort will be distributed across the project duration ({formData.startDate} to {formData.endDate}).
              </p>
            </div>

            {/* Skills Management */}
            <div className="grid gap-2">
              <Label>Required Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentSkills.map(skill => (
                  <Badge key={skill.id} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                    {skill.name}
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {currentSkills.length === 0 && (
                  <span className="text-sm text-slate-500 italic">No skills required yet.</span>
                )}
              </div>
              <div className="flex gap-2">
                <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Add skill..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allSkills
                      .filter(s => !currentSkills.some(cs => cs.id === s.id))
                      .map(skill => (
                        <SelectItem key={skill.id} value={skill.id.toString()}>
                          {skill.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={handleAddSkill} disabled={!selectedSkillId}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border-t border-slate-200 my-4" />

            {/* Smart Suggestions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-slate-900">Smart Suggestions</h3>
                </div>
                <Button onClick={handleSuggest} disabled={suggestResources.isPending || !formData.estimatedHours}>
                  {suggestResources.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                  Find Resources
                </Button>
              </div>

              {!formData.estimatedHours && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm">
                  Please enter Estimated Effort to get allocation suggestions.
                </div>
              )}

              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <Card key={suggestion.resource.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {suggestion.resource.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{suggestion.resource.name}</div>
                          <div className="text-xs text-slate-500">{suggestion.resource.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={cn("text-xs font-bold", suggestion.skillScore >= 100 ? "text-green-600" : "text-amber-600")}>
                            {Math.round(suggestion.skillScore)}%
                          </div>
                          <div className="text-[10px] text-slate-500">Skill Match</div>
                        </div>

                        <div className="text-center">
                          <div className={cn("text-xs font-bold", suggestion.availabilityScore > 80 ? "text-green-600" : "text-slate-600")}>
                            {Math.round(suggestion.netAvailability)}h
                          </div>
                          <div className="text-[10px] text-slate-500">Avg Avail/Wk</div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAllocate(suggestion.resource.id)}
                          disabled={allocateResources.isPending}
                        >
                          Assign
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm border border-dashed rounded-lg">
                  {suggestResources.isSuccess ? "No matching resources found." : "Click 'Find Resources' to get AI-powered suggestions."}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
