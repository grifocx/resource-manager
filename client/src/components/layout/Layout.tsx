import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  Layers, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import logo from "@assets/generated_images/minimalist_abstract_geometric_logo_for_it_resource_management.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useToast();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Resources", icon: Users, href: "/resources" },
    { label: "Work Items", icon: Briefcase, href: "/work" },
    { label: "Capacity", icon: BarChart3, href: "/capacity" },
    { label: "Portfolio", icon: Layers, href: "/portfolio" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <img src={logo} alt="Resource-IT Logo" className="h-8 w-8 rounded mr-3" />
          <span className="font-display font-bold text-xl text-white tracking-tight">Resource-IT</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto lg:hidden text-slate-400"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-200" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigate("/settings")}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-sm font-medium",
              location === "/settings"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
            data-testid="button-settings"
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
          <button 
            onClick={() => {
              toast({
                title: "Sign Out",
                description: "Authentication is not enabled. This feature requires user login functionality to be implemented.",
              });
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium text-slate-400 hover:text-white mt-1"
            data-testid="button-signout"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
          
          <div 
            className="mt-6 flex items-center gap-3 px-3 cursor-pointer rounded-lg py-2 hover:bg-slate-800 transition-colors"
            onClick={() => navigate("/settings")}
            data-testid="button-profile"
          >
            <Avatar className="h-9 w-9 border border-slate-700">
              <AvatarImage src="" />
              <AvatarFallback className="bg-indigo-900 text-indigo-200 text-xs">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-slate-500 truncate">Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <span className="font-display font-bold text-lg">Resource-IT</span>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}