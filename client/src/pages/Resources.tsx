import Layout from "@/components/layout/Layout";
import { RESOURCES, getTeamName, TEAMS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";

export default function Resources() {
  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Resources</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage team members, skills, and availability.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search people..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESOURCES.map((resource) => (
          <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                  <span className="font-medium text-slate-900">{getTeamName(resource.teamId)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Capacity</span>
                  <span className="font-medium text-slate-900">{resource.capacity} hrs/week</span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                  <Button variant="ghost" size="sm" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">Allocations</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}