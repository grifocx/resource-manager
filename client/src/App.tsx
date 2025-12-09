import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Resources from "@/pages/Resources";
import Work from "@/pages/Work";
import Capacity from "@/pages/Capacity";
import Portfolio from "@/pages/Portfolio";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/resources" component={Resources} />
      <Route path="/work" component={Work} />
      <Route path="/capacity" component={Capacity} />
      <Route path="/portfolio" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;