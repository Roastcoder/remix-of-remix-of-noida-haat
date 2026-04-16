import { Outlet } from "react-router-dom";
import { PanelSidebar, PanelMobileHeader } from "@/components/PanelSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { LayoutDashboard, Users, Package, PhoneCall, BarChart3, Settings, ImageIcon, Share2 } from "lucide-react";

const adminNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Leads", path: "/admin/leads" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: ImageIcon, label: "Banners", path: "/admin/banners" },
  { icon: Share2, label: "Social Media", path: "/admin/social" },
  { icon: PhoneCall, label: "Telecallers", path: "/admin/telecallers" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

// Bottom nav shows max 5 most important items
const adminBottomNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Leads", path: "/admin/leads" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <PanelSidebar items={adminNav} title="Admin Panel" />
      <div className="flex-1 flex flex-col min-w-0">
        <PanelMobileHeader title="Admin Panel" />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav items={adminBottomNav} />
    </div>
  );
}
