import { Outlet } from "react-router-dom";
import { PanelSidebar, PanelMobileHeader } from "@/components/PanelSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Home, Package, FileText, Calculator, UserCircle } from "lucide-react";

const customerNav = [
  { icon: Home, label: "Home", path: "/customer" },
  { icon: Package, label: "Products", path: "/customer/products" },
  { icon: FileText, label: "Enquiries", path: "/customer/enquiries" },
  { icon: Calculator, label: "Get Quote", path: "/customer/quote" },
  { icon: UserCircle, label: "Profile", path: "/customer/profile" },
];

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <PanelSidebar items={customerNav} title="Customer Panel" />
      <div className="flex-1 flex flex-col min-w-0">
        <PanelMobileHeader title="Customer Panel" />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav items={customerNav} />
    </div>
  );
}
