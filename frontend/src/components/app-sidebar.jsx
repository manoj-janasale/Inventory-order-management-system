import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";

export function AppSidebar({ currentView, setView }) {
  // Navigation configuration array to keep code DRY and manageable
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6 text-xl font-bold">
        Inventory
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton 
                  onClick={() => setView(item.id)}
                  className={isActive ? "bg-slate-100 font-semibold text-slate-900" : ""}
                >
                  <Icon className={isActive ? "text-slate-900" : "text-slate-500"} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
