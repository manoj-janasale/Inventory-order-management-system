import { LayoutDashboard, Package, Users, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Products",
    icon: Package,
    path: "/products",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    path: "/orders",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg border-r">
      <div className="text-2xl font-bold p-6">
        Inventory
      </div>

      <nav className="space-y-2 px-4">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}