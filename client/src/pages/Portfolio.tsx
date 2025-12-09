import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useWorkItems, useCreateWorkItem } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Portfolio() {
  const { data: workItems = [], isLoading } = useWorkItems();
  const createWorkItem = useCreateWorkItem();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Demand",
    status: "New",
    priority: "Medium",
    startDate: "",
    endDate: "",
    description: "",
  });

  const projects = workItems.filter(w => w.type === "Project");
  const demands = workItems.filter(w => w.type === "Demand");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate || !formData.description) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    try {
      await createWorkItem.mutateAsync({
        title: formData.title,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        progress: 0,
      });
      toast({ title: "Success", description: "Strategic initiative created successfully" });
      setDialogOpen(false);
      setFormData({
        title: "",
        type: "Demand",
        status: "New",
        priority: "Medium",
        startDate: "",
        endDate: "",
        description: "",
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create initiative", variant: "destructive" });
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
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Portfolio Strategy</h1>
          <p className="text-slate-500 dark:text-slate-400">High-level view of all IT demands and active projects.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" data-testid="button-new-initiative">
              <Plus className="h-4 w-4 mr-2" />
              New Strategic Initiative
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Strategic Initiative</DialogTitle>
              <DialogDescription>
                Add a new demand or project to the portfolio.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="New Platform Initiative"
                    data-testid="input-initiative-title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                      <SelectTrigger data-testid="select-initiative-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Project">Project</SelectItem>
                        <SelectItem value="Demand">Demand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                      <SelectTrigger data-testid="select-initiative-priority">
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      data-testid="input-initiative-start-date"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      data-testid="input-initiative-end-date"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the strategic initiative..."
                    data-testid="input-initiative-description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createWorkItem.isPending} data-testid="button-submit-initiative">
                  {createWorkItem.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Initiative
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Demand Pipeline</h2>
            <Badge variant="outline">{demands.length} Items</Badge>
          </div>
          
          <div className="space-y-4">
            {demands.map(item => (
              <Card key={item.id} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow" data-testid={`card-demand-${item.id}`}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">Demand</Badge>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.status}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">Est. Start: {item.startDate}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-indigo-600 p-0 h-auto hover:bg-transparent hover:text-indigo-800"
                      onClick={() => setLocation("/work")}
                      data-testid={`button-review-demand-${item.id}`}
                    >
                      Review <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {demands.length === 0 && (
              <Card className="border-l-4 border-l-slate-300 border-dashed bg-slate-50">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                    <Plus className="h-5 w-5 text-slate-400" />
                  </div>
                  <h3 className="font-medium text-slate-900">No Demands</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs">Submit a new demand using the button above.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-800">Active Portfolio</h2>
             <Badge variant="outline">{projects.length} Active</Badge>
          </div>

          {projects.length > 0 ? (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-8 py-2">
               {projects.map((project) => (
                 <div key={project.id} className="relative" data-testid={`card-project-${project.id}`}>
                   <div className={cn(
                     "absolute -left-[41px] top-4 h-5 w-5 rounded-full border-4 border-white shadow-sm",
                     project.status === "In Progress" ? "bg-green-500" : "bg-blue-500"
                   )} />
                   <Card className="hover:shadow-md transition-shadow">
                     <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-slate-900">{project.title}</h3>
                            {(project.priority === "High" || project.priority === "Critical") && (
                              <span className="h-2 w-2 rounded-full bg-orange-500" title="High Priority" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                             <span className="text-xs text-slate-400 block mb-1">Timeline</span>
                             <span className="text-slate-700 font-medium">{project.startDate} - {project.endDate}</span>
                          </div>
                          <div>
                             <span className="text-xs text-slate-400 block mb-1">Status</span>
                             <Badge variant="outline" className={cn(
                               project.status === "In Progress" ? "bg-green-50 text-green-700 border-green-200" :
                               project.status === "Completed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                               "bg-slate-50 text-slate-700 border-slate-200"
                             )}>{project.status}</Badge>
                          </div>
                        </div>
                     </CardContent>
                   </Card>
                 </div>
               ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              No active projects. Create a project to see it here.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
