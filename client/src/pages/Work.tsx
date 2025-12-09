import Layout from "@/components/layout/Layout";
import { WORK_ITEMS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Work() {
  return (
    <Layout>
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Work Items</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage projects, demands, and operational tasks.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Work Item
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search work items..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 mb-6">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="demands">Demands</TabsTrigger>
            <TabsTrigger value="ktlo">KTLO</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {WORK_ITEMS.map((item) => (
              <Card key={item.id} className="hover:border-indigo-300 transition-colors cursor-pointer group">
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
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="h-5 w-5" />
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
            ))}
          </TabsContent>
          
          <TabsContent value="projects">
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              Filtered view for Projects would go here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}