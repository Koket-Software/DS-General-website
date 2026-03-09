import { useLocation } from "@tanstack/react-router";
import { PanelLeft } from "lucide-react";
import { useEffect } from "react";

import User from "./components/user";

import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { sidebarData } from "@/config/sidebar-data";

export default function Header() {
  const location = useLocation();
  const { toggleSidebar, isMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, location.pathname, setOpenMobile]);

  // Find current page info from sidebar data
  const currentPage = sidebarData.navGroups
    .flatMap((group) => group.items)
    .find((item) => item.url === location.pathname);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 px-3 py-2 backdrop-blur-sm md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-none md:hidden"
            onClick={toggleSidebar}
            aria-label="Open navigation"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          {currentPage?.icon && <currentPage.icon className="h-5 w-5" />}
          <h1 className="truncate text-base font-semibold md:text-lg">
            {currentPage?.title || "Dashboard"}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <ThemeSwitch />
          <User />
        </div>
      </div>
    </header>
  );
}
