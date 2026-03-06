import { useLocation } from "@tanstack/react-router";

import User from "./components/user";

import { ThemeSwitch } from "@/components/theme-switch";
import { sidebarData } from "@/config/sidebar-data";

export default function Header() {
  const location = useLocation();

  // Find current page info from sidebar data
  const currentPage = sidebarData.navGroups
    .flatMap((group) => group.items)
    .find((item) => item.url === location.pathname);

  return (
    <header className="flex items-center justify-between px-2 md:px-6 py-1 border-b bg-background">
      {/* Left side - Back button and page title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 md:ml-4">
          {currentPage?.icon && <currentPage.icon className="h-5 w-5" />}
          <h1 className="text-xl font-semibold">
            {currentPage?.title || "Dashboard"}
          </h1>
        </div>
      </div>

      {/* Right side - Theme and User profile */}
      <div className="flex items-center gap-4">
        <ThemeSwitch />
        <User />
      </div>
    </header>
  );
}
