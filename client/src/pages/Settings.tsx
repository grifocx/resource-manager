import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Monitor, Palette, Layout as LayoutIcon, Bell } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [defaultCapacityView, setDefaultCapacityView] = useState("weekly");
  const [compactMode, setCompactMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your application preferences and display settings.</p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how Resource-IT looks on your device</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Theme</Label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-3 gap-4"
              >
                <Label
                  htmlFor="light"
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    theme === "light"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                  data-testid="theme-light"
                >
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                  <Sun className="h-6 w-6 mb-2 text-amber-500" />
                  <span className="text-sm font-medium">Light</span>
                </Label>
                <Label
                  htmlFor="dark"
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    theme === "dark"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                  data-testid="theme-dark"
                >
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <Moon className="h-6 w-6 mb-2 text-indigo-500" />
                  <span className="text-sm font-medium">Dark</span>
                </Label>
                <Label
                  htmlFor="system"
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    theme === "system"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                  data-testid="theme-system"
                >
                  <RadioGroupItem value="system" id="system" className="sr-only" />
                  <Monitor className="h-6 w-6 mb-2 text-slate-500" />
                  <span className="text-sm font-medium">System</span>
                </Label>
              </RadioGroup>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Compact Mode</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Use smaller spacing and fonts throughout the app
                </p>
              </div>
              <Switch
                checked={compactMode}
                onCheckedChange={setCompactMode}
                data-testid="switch-compact-mode"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <LayoutIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>Configure default views and display options</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Default Capacity View</Label>
              <Select value={defaultCapacityView} onValueChange={setDefaultCapacityView}>
                <SelectTrigger className="w-full" data-testid="select-capacity-view">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly View</SelectItem>
                  <SelectItem value="monthly">Monthly View</SelectItem>
                  <SelectItem value="quarterly">Quarterly View</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose the default time range when viewing capacity planning
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Show Notifications</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receive alerts for critical items and deadlines
                </p>
              </div>
              <Switch
                checked={showNotifications}
                onCheckedChange={setShowNotifications}
                data-testid="switch-notifications"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
