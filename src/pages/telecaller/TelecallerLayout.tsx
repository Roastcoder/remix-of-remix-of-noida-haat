import { Outlet } from "react-router-dom";
import { PanelSidebar, PanelMobileHeader } from "@/components/PanelSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Users, PhoneCall, CalendarClock, TrendingUp } from "lucide-react";

const tcNav = [
  { icon: Users, label: "My Leads", path: "/telecaller" },
  { icon: PhoneCall, label: "Call History", path: "/telecaller/calls" },
  { icon: CalendarClock, label: "Follow-ups", path: "/telecaller/followups" },
  { icon: TrendingUp, label: "Performance", path: "/telecaller/performance" },
];

export default function TelecallerLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <PanelSidebar items={tcNav} title="Telecaller Panel" />
      <div className="flex-1 flex flex-col min-w-0">
        <PanelMobileHeader title="Telecaller Panel" />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav items={tcNav} />
    </div>
  );
}
