import Layout from "@/components/layout/Layout";
import { WORK_ITEMS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Portfolio() {
  const projects = WORK_ITEMS.filter(w => w.type === "Project");
  const demands = WORK_ITEMS.filter(w => w.type === "Demand");

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Portfolio Strategy</h1>
          <p className="text-slate-500 dark:text-slate-400">High-level view of all IT demands and active projects.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Strategic Initiative
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demand Pipeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Demand Pipeline</h2>
            <Badge variant="outline">{demands.length} Items</Badge>
          </div>
          
          <div className="space-y-4">
            {demands.map(item => (
              <Card key={item.id} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">Demand</Badge>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.status}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">Est. Start: {item.startDate}</span>
                    <Button variant="ghost" size="sm" className="text-indigo-600 p-0 h-auto hover:bg-transparent hover:text-indigo-800">
                      Review <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add a fake card to make it look full */}
            <Card className="border-l-4 border-l-slate-300 border-dashed bg-slate-50">
               <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
                 <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                   <Plus className="h-5 w-5 text-slate-400" />
                 </div>
                 <h3 className="font-medium text-slate-900">New Demand</h3>
                 <p className="text-sm text-slate-500 mt-1 max-w-xs">Submit a new demand for initial review and capacity analysis.</p>
               </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Projects Portfolio */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-800">Active Portfolio</h2>
             <Badge variant="outline">{projects.length} Active</Badge>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-8 py-2">
             {projects.map((project, idx) => (
               <div key={project.id} className="relative">
                 <div className={cn(
                   "absolute -left-[41px] top-4 h-5 w-5 rounded-full border-4 border-white shadow-sm",
                   project.status === "In Progress" ? "bg-green-500" : "bg-blue-500"
                 )} />
                 <Card className="hover:shadow-md transition-shadow">
                   <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-slate-900">{project.title}</h3>
                          {project.priority === "High" && <span className="h-2 w-2 rounded-full bg-orange-500" title="High Priority" />}
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
                           <span className="text-xs text-slate-400 block mb-1">Health</span>
                           <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">On Track</Badge>
                        </div>
                      </div>
                   </CardContent>
                 </Card>
               </div>
             ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}