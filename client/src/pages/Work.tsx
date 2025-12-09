import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { useWorkItems, useCreateWorkItem, useDeleteWorkItem } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  Search, 
  Plus, 
  Calendar,
  Trash2,
  Loader2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSearch, useLocation } from "wouter";

export default function Work() {
  const { data: workItems = [], isLoading } = useWorkItems();
  const createWorkItem = useCreateWorkItem();
  const deleteWorkItem = useDeleteWorkItem();
  const { toast } = useToast();
  const searchParams = useSearch();
  const [, navigate] = useLocation();
  
  const urlParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const tabFromUrl = urlParams.get("tab");
  const statusFilter = urlParams.get("status");
  const priorityFilter = urlParams.get("priority");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    type: "Project",
    status: "New",
    priority: "Medium",
    startDate: "",
    endDate: "",
    description: "",
    progress: "0",
  });

  useEffect(() => {
    if (tabFromUrl === "projects") {
      setActiveTab("projects");
    } else if (tabFromUrl === "demands") {
      setActiveTab("demands");
    } else if (tabFromUrl === "ktlo") {
      setActiveTab("ktlo");
    }
  }, [tabFromUrl]);

  const filteredItems = useMemo(() => {
    return workItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesPriority = !priorityFilter || item.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [workItems, searchTerm, statusFilter, priorityFilter]);
  
  const clearFilters = () => {
    navigate("/work");
  };
  
  const hasActiveFilters = statusFilter || priorityFilter;

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
        progress: parseInt(formData.progress),
      });
      toast({ title: "Success", description: "Work item created successfully" });
      setDialogOpen(false);
      setFormData({
        title: "",
        type: "Project",
        status: "New",
        priority: "Medium",
        startDate: "",
        endDate: "",
        description: "",
        progress: "0",
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create work item", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWorkItem.mutateAsync(id);
      toast({ title: "Success", description: "Work item deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete work item", variant: "destructive" });
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
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Work Items</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage projects, demands, and operational tasks.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" data-testid="button-new-work-item">
              <Plus className="h-4 w-4 mr-2" />
              New Work Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Work Item</DialogTitle>
              <DialogDescription>
                Add a new project, demand, or KTLO task.
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
                    placeholder="Cloud Migration Phase 2"
                    data-testid="input-work-item-title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                      <SelectTrigger data-testid="select-work-item-type">
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
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                      <SelectTrigger data-testid="select-work-item-priority">
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
                      data-testid="input-work-item-start-date"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      data-testid="input-work-item-end-date"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the work item..."
                    data-testid="input-work-item-description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createWorkItem.isPending} data-testid="button-submit-work-item">
                  {createWorkItem.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Work Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search work items..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-work-items"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Active filters:</span>
            {statusFilter && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                Status: {statusFilter}
              </Badge>
            )}
            {priorityFilter && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                Priority: {priorityFilter}
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="ml-auto text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
              data-testid="button-clear-filters"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 mb-6">
            <TabsTrigger value="all" data-testid="tab-all">All Items ({filteredItems.length})</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects ({filteredItems.filter(i => i.type === "Project").length})</TabsTrigger>
            <TabsTrigger value="demands" data-testid="tab-demands">Demands ({filteredItems.filter(i => i.type === "Demand").length})</TabsTrigger>
            <TabsTrigger value="ktlo" data-testid="tab-ktlo">KTLO ({filteredItems.filter(i => i.type === "KTLO").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Card key={item.id} className="hover:border-indigo-300 transition-colors group" data-testid={`card-work-item-${item.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-3 rounded-lg mt-1",
                          item.type === "Project" ? "bg-indigo-100 text-indigo-600" :
                          item.type === "Demand" ? "bg-purple-100 text-purple-600" :
                          "bg-orange-100 text-orange-600"
                        )}>
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                            <Badge variant="outline" className={cn(
                              "border-0",
                              item.priority === "Critical" ? "bg-red-100 text-red-700" :
                              item.priority === "High" ? "bg-orange-100 text-orange-700" :
                              "bg-green-100 text-green-700"
                            )}>
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-slate-500 mb-3 max-w-2xl">{item.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>{item.startDate} - {item.endDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-700">Status:</span>
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                item.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                item.status === "Completed" ? "bg-green-100 text-green-700" :
                                "bg-slate-100 text-slate-700"
                              )}>{item.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-4 min-w-[200px]">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteWorkItem.isPending}
                          data-testid={`button-delete-work-item-${item.id}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-medium text-slate-900">{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                No work items found. {searchTerm ? "Try a different search term." : "Create your first work item to get started."}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            {filteredItems.filter(i => i.type === "Project").length > 0 ? (
              filteredItems.filter(i => i.type === "Project").map((item) => (
                <Card key={item.id} className="hover:border-indigo-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-slate-500">{item.description}</p>
                      </div>
                      <Progress value={item.progress} className="w-32 h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                No projects found
              </div>
            )}
          </TabsContent>

          <TabsContent value="demands" className="space-y-4">
            {filteredItems.filter(i => i.type === "Demand").length > 0 ? (
              filteredItems.filter(i => i.type === "Demand").map((item) => (
                <Card key={item.id} className="hover:border-indigo-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-slate-500">{item.description}</p>
                      </div>
                      <Badge>{item.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                No demands found
              </div>
            )}
          </TabsContent>

          <TabsContent value="ktlo" className="space-y-4">
            {filteredItems.filter(i => i.type === "KTLO").length > 0 ? (
              filteredItems.filter(i => i.type === "KTLO").map((item) => (
                <Card key={item.id} className="hover:border-indigo-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-slate-500">{item.description}</p>
                      </div>
                      <Badge variant="outline">{item.priority}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                No KTLO tasks found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
