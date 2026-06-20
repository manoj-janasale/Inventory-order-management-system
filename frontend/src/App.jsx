import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";

export default function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />

          <main className="flex-1 p-8">
            <SidebarTrigger />

            <h1 className="mt-6 text-4xl font-bold">
              Inventory Dashboard
            </h1>

            <p className="mt-2 text-muted-foreground">
              React + FastAPI + PostgreSQL
            </p>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}