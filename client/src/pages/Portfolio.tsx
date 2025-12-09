import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useWorkItems, usePortfolios, usePrograms, useCreateWorkItem, getProgramName } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Plus, Loader2, ChevronDown, ChevronRight, Folder, FolderOpen, FileText, DollarSign, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Portfolio, Program, WorkItem } from "@shared/schema";

function formatBudget(amount: number | string | null): string {
  if (!amount) return "N/A";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "N/A";
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Active":
    case "In Progress":
      return "bg-green-100 text-green-700 border-green-200";
    case "Planning":
    case "New":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "On Hold":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Completed":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-700";
    case "High":
      return "bg-orange-100 text-orange-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Low":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function WorkItemCard({ item }: { item: WorkItem }) {
  return (
    <Card className="border-l-4 border-l-slate-300 hover:shadow-sm transition-shadow" data-testid={`card-workitem-${item.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-900">{item.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", getPriorityColor(item.priority))}>
              {item.priority}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", getStatusColor(item.status))}>
              {item.status}
            </Badge>
          </div>
        </div>
        {item.description && (
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {item.startDate} - {item.endDate}
          </span>
          {item.estimatedBudget && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {formatBudget(item.estimatedBudget)}
            </span>
          )}
        </div>
        {item.progress > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProgramSection({ program, workItems }: { program: Program; workItems: WorkItem[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const programWorkItems = workItems.filter(w => w.programId === program.id);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="ml-4 border-l-2 border-slate-200 pl-4">
      <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 hover:bg-slate-50 rounded px-2 -ml-2" data-testid={`trigger-program-${program.id}`}>
        {isOpen ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
        {isOpen ? <FolderOpen className="h-4 w-4 text-indigo-500" /> : <Folder className="h-4 w-4 text-indigo-500" />}
        <span className="font-medium text-slate-800">{program.name}</span>
        <Badge variant="outline" className={cn("ml-auto text-xs", getStatusColor(program.status || "Active"))}>
          {program.status || "Active"}
        </Badge>
        <Badge variant="secondary" className="text-xs">{programWorkItems.length} items</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-2 pb-4">
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 pl-6">
          {program.programManager && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {program.programManager}
            </span>
          )}
          {program.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {formatBudget(program.budget)}
            </span>
          )}
          {program.startDate && program.endDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {program.startDate} - {program.endDate}
            </span>
          )}
        </div>
        <div className="space-y-2 pl-6">
          {programWorkItems.length > 0 ? (
            programWorkItems.map(item => (
              <WorkItemCard key={item.id} item={item} />
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No work items in this program</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function PortfolioCard({ portfolio, programs, workItems }: { portfolio: Portfolio; programs: Program[]; workItems: WorkItem[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const portfolioPrograms = programs.filter(p => p.portfolioId === portfolio.id);
  const portfolioWorkItems = workItems.filter(w => {
    const program = programs.find(p => p.id === w.programId);
    return program?.portfolioId === portfolio.id;
  });
  
  const totalBudget = portfolioPrograms.reduce((sum, p) => sum + (p.budget || 0), 0);
  const avgProgress = portfolioWorkItems.length > 0 
    ? Math.round(portfolioWorkItems.reduce((sum, w) => sum + (w.progress || 0), 0) / portfolioWorkItems.length)
    : 0;
  
  return (
    <Card className="overflow-hidden" data-testid={`card-portfolio-${portfolio.id}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors" data-testid={`trigger-portfolio-${portfolio.id}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
                <div>
                  <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                  {portfolio.description && (
                    <p className="text-sm text-slate-500 mt-1">{portfolio.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn(getStatusColor(portfolio.status || "Active"))}>
                  {portfolio.status || "Active"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-3 text-sm text-slate-600 pl-8">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-slate-400" />
                <span><strong>{portfolioPrograms.length}</strong> Programs</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span><strong>{portfolioWorkItems.length}</strong> Work Items</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <span><strong>{formatBudget(totalBudget)}</strong> Total Budget</span>
              </div>
              {portfolio.owner && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{portfolio.owner}</span>
                </div>
              )}
            </div>
            {portfolioWorkItems.length > 0 && (
              <div className="mt-3 pl-8">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Overall Progress</span>
                  <span>{avgProgress}%</span>
                </div>
                <Progress value={avgProgress} className="h-2" />
              </div>
            )}
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            {portfolioPrograms.length > 0 ? (
              <div className="space-y-2">
                {portfolioPrograms.map(program => (
                  <ProgramSection key={program.id} program={program} workItems={workItems} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic ml-8">No programs in this portfolio</p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function Portfolio() {
  const { data: workItems = [], isLoading: workItemsLoading } = useWorkItems();
  const { data: portfolios = [], isLoading: portfoliosLoading } = usePortfolios();
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const createWorkItem = useCreateWorkItem();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Demand",
    status: "New",
    priority: "Medium",
    startDate: "",
    endDate: "",
    description: "",
    programId: "",
  });

  const isLoading = workItemsLoading || portfoliosLoading || programsLoading;

  const unassignedWorkItems = workItems.filter(w => !w.programId);

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
        programId: formData.programId ? parseInt(formData.programId) : null,
      });
      toast({ title: "Success", description: "Work item created successfully" });
      setDialogOpen(false);
      setFormData({
        title: "",
        type: "Demand",
        status: "New",
        priority: "Medium",
        startDate: "",
        endDate: "",
        description: "",
        programId: "",
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create work item", variant: "destructive" });
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

  const totalBudget = portfolios.reduce((sum, p) => sum + (p.budget || 0), 0);
  const activePrograms = programs.filter(p => p.status === "Active" || p.status === "In Progress").length;

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Portfolio Strategy</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage portfolios, programs, and work items across the organization.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" data-testid="button-new-workitem">
              <Plus className="h-4 w-4 mr-2" />
              New Work Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Work Item</DialogTitle>
              <DialogDescription>
                Add a new project, demand, or KTLO item.
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
                    placeholder="Work item title"
                    data-testid="input-workitem-title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="program">Program (Optional)</Label>
                  <Select value={formData.programId} onValueChange={(v) => setFormData({ ...formData, programId: v })}>
                    <SelectTrigger data-testid="select-workitem-program">
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Program</SelectItem>
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
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                      <SelectTrigger data-testid="select-workitem-type">
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
                      <SelectTrigger data-testid="select-workitem-priority">
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
                      data-testid="input-workitem-start-date"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      data-testid="input-workitem-end-date"
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
                    data-testid="input-workitem-description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createWorkItem.isPending} data-testid="button-submit-workitem">
                  {createWorkItem.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Work Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card data-testid="stat-portfolios">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Folder className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900" data-testid="stat-portfolios-count">{portfolios.length}</p>
                <p className="text-sm text-slate-500">Portfolios</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-programs">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FolderOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900" data-testid="stat-programs-count">{activePrograms}</p>
                <p className="text-sm text-slate-500">Active Programs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-workitems">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900" data-testid="stat-workitems-count">{workItems.length}</p>
                <p className="text-sm text-slate-500">Work Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-budget">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900" data-testid="stat-budget-total">{formatBudget(totalBudget)}</p>
                <p className="text-sm text-slate-500">Total Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800">Portfolio Hierarchy</h2>
        
        {portfolios.length > 0 ? (
          <div className="space-y-4">
            {portfolios.map(portfolio => (
              <PortfolioCard 
                key={portfolio.id} 
                portfolio={portfolio} 
                programs={programs}
                workItems={workItems}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Folder className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-medium text-slate-900 mb-2">No Portfolios Yet</h3>
              <p className="text-sm text-slate-500">Create portfolios to organize your programs and work items.</p>
            </CardContent>
          </Card>
        )}

        {unassignedWorkItems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Unassigned Work Items</h2>
            <div className="grid gap-3">
              {unassignedWorkItems.map(item => (
                <WorkItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
