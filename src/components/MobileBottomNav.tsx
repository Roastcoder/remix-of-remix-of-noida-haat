import { NavLink, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface Props {
  items: NavItem[];
}

export function MobileBottomNav({ items }: Props) {
  const location = useLocation();
  // Show max 5 items on mobile
  const visibleItems = items.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[56px] transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
