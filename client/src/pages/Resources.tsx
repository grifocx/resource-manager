import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useTeams, useResources, useCreateResource, useDeleteResource, getTeamName } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Plus, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Resources() {
  const { data: resources = [], isLoading: resourcesLoading } = useResources();
  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const createResource = useCreateResource();
  const deleteResource = useDeleteResource();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    teamId: "",
    capacity: "40",
    email: "",
  });

  const isLoading = resourcesLoading || teamsLoading;

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.teamId || !formData.email) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    try {
      await createResource.mutateAsync({
        name: formData.name,
        role: formData.role,
        teamId: parseInt(formData.teamId),
        capacity: parseInt(formData.capacity),
        email: formData.email,
        avatar: formData.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
      });
      toast({ title: "Success", description: "Resource created successfully" });
      setDialogOpen(false);
      setFormData({ name: "", role: "", teamId: "", capacity: "40", email: "" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create resource", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteResource.mutateAsync(id);
      toast({ title: "Success", description: "Resource deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
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
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Resources</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage team members, skills, and availability.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" data-testid="button-add-resource">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>
                Add a new team member to your resource pool.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    data-testid="input-resource-name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Senior Engineer"
                    data-testid="input-resource-role"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    data-testid="input-resource-email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team">Team</Label>
                  <Select value={formData.teamId} onValueChange={(v) => setFormData({ ...formData, teamId: v })}>
                    <SelectTrigger data-testid="select-resource-team">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Weekly Capacity (hours)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    data-testid="input-resource-capacity"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createResource.isPending} data-testid="button-submit-resource">
                  {createResource.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Resource
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search people..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-resources"
          />
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow" data-testid={`card-resource-${resource.id}`}>
              <div className="h-2 bg-indigo-600 w-full" />
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{resource.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold text-slate-900 truncate">{resource.name}</CardTitle>
                  <CardDescription className="truncate">{resource.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Team</span>
                    <span className="font-medium text-slate-900">{getTeamName(teams, resource.teamId)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Capacity</span>
                    <span className="font-medium text-slate-900">{resource.capacity} hrs/week</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-900 truncate ml-2">{resource.email}</span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleDelete(resource.id)}
                      disabled={deleteResource.isPending}
                      data-testid={`button-delete-resource-${resource.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-slate-500">No resources found. {searchTerm ? "Try a different search term." : "Add your first resource to get started."}</p>
        </div>
      )}
    </Layout>
  );
}
