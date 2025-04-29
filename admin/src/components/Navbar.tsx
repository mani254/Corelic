"use client";

import navItems, { ItemType } from "@/utils/navbar";
import { ChevronDown } from "lucide-react"; // Import an arrow icon
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

// Helper: Find if the route is active or any of its children are active
const isRouteActive = (item: ItemType, currentPath: string): boolean => {
  if (item.route === currentPath) return true;
  if (item.children) {
    return item.children.some((child) => isRouteActive(child, currentPath));
  }
  return false;
};

const Sidebar = () => {
  const pathname = usePathname();

  // Memoize active checks for better performance
  const activePaths = useMemo(() => {
    const paths: Record<string, boolean> = {};

    const findPaths = (items: ItemType[]) => {
      items.forEach((item) => {
        if (item.route) {
          paths[item.route] = isRouteActive(item, pathname);
        }
        if (item.children) {
          findPaths(item.children);
        }
      });
    };

    findPaths(navItems);
    return paths;
  }, [pathname]);

  const renderNavItems = (items: ItemType[], level = 0) => {
    return (
      <ul className={level > 0 ? "" : ""}>
        {items.map((item) => {
          if (!item.route) {
            console.error(`Item "${item.label}" is missing a route.`);
            return null;
          }

          const isActive = pathname === item.route;
          const isExpanded = activePaths[item.route];
          const shouldHighlight = isActive || isExpanded;

          return (
            <li key={item.label}>
              <Link href={item.route} className={`relative flex items-center justify-between px-4 p-2 rounded-md transition-all hover:bg-gray-50 ${shouldHighlight ? (level > 0 ? "font-semibold" : "bg-gray-100 hover:bg-gray-200") : ""} ${level > 0 ? "text-[14px]" : "text-[15px]"}`}>
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </div>
                {level > 0 && (<div className={`absolute h-[2px] w-2  bg-gray-300 ${shouldHighlight && "bg-gray-500"}  left-0 top-1/2`}></div>)}

                {/* Only show arrow if it has children */}
                {item.children && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                  />
                )}
              </Link>

              {/* If it has children and is expanded, show them */}
              {item.children && isExpanded && (
                <div className={`mt-1 ml-5 border-l border-gray-300`}>
                  {renderNavItems(item.children, level + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside className="w-64 px-4 h-full overflow-auto min-w-[250px] bg-white border border-gray-300">
      {renderNavItems(navItems)}
    </aside>
  );
};

export default Sidebar;
