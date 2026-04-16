import { NavLink, useLocation } from "react-router-dom";
import { LogOut, LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface Props {
  items: NavItem[];
  title: string;
}

export function PanelSidebar({ items, title }: Props) {
  const { signOut, profile } = useAuth();
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-card border-r border-border flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-sm font-bold text-foreground">Chauhaan Computers</span>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{title}</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{profile?.full_name || "User"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors w-full rounded-lg hover:bg-muted/50"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function PanelMobileHeader({ title }: { title: string }) {
  const { signOut, profile } = useAuth();

  return (
    <header className="md:hidden sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-foreground">Chauhaan Computers</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{title}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
          {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <button onClick={signOut} className="text-xs text-muted-foreground hover:text-destructive">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
