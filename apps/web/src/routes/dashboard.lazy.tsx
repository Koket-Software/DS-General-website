import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import Cookies from "js-cookie";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/layout/app-sidebar";
import Header from "@/features/dashboard/layout/header";
import { cn } from "@/lib/utils";

export const Route = createLazyFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const defaultOpen = Cookies.get("sidebar_state") !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen} data-dashboard="true">
      <AppSidebar />
      <div
        id="content"
        className={cn(
          "ml-auto w-full max-w-full",
          "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
          "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
          "transition-[width] duration-200 ease-linear",
          "flex min-h-svh flex-col",
          "group-data-[scroll-locked=1]/body:h-full",
          "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh",
        )}
      >
        <Header />
        <main id="dashboard-main" className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
