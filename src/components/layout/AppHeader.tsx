
import { Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
 
 export function AppHeader() {
   return (
    <header className="h-14 flex items-center gap-3 border-b border-border/70 px-4 bg-background/95 backdrop-blur-sm">
       <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="flex-1 max-w-sm">
         <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
         <Input placeholder="Search…" className="pl-9 h-9 bg-background" />
         </div>
       </div>
       
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
           <Bell className="h-4 w-4" />
         </Button>
        <Popover>
         <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Open settings">
              <Settings className="h-4 w-4" />
           </Button>
          </PopoverTrigger>
         <PopoverContent align="end" className="w-72 p-3">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Settings</p>
               <p className="text-xs text-muted-foreground">Quick preferences</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border border-border/70 p-2">
                  <Label htmlFor="settings-notifications" className="text-xs font-medium">Notifications</Label>
                  <Switch id="settings-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-md border border-border/70 p-2">
                  <Label htmlFor="settings-compact" className="text-xs font-medium">Compact mode</Label>
                  <Switch id="settings-compact" defaultChecked />
                </div>
              </div>

              <Button variant="outline" className="w-full h-8 text-xs">Open full settings</Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-8 rounded-full border border-border text-xs font-medium flex items-center justify-center text-muted-foreground">
           FL
         </div>
       </div>
     </header>
   );
 }
