import { LayoutDashboard, Package, Users, ShoppingCart, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Products", icon: Package, path: "/products" },
  { title: "Customers", icon: Users, path: "/customers" },
  { title: "Orders", icon: ShoppingCart, path: "/orders" },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  return (
    <>
      {/* Backdrop, mobile only */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed z-40 flex h-screen w-64 flex-col bg-[#12161D] text-slate-300 transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-6 py-7">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-['Space_Grotesk'] text-2xl font-semibold text-white">
                INV
              </span>
              <span className="font-['JetBrains_Mono'] text-xs tracking-[0.2em] text-[#E08A1E]">
                //OS
              </span>
            </div>
            <div className="mt-2 h-[3px] w-10 bg-[#E08A1E]" />
            <p className="mt-3 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.15em] text-slate-500">
              Operations Console
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded text-slate-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E08A1E] md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 border-l-[3px] px-4 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E08A1E] focus-visible:ring-inset ${
                    isActive
                      ? "border-[#E08A1E] bg-white/5 text-white"
                      : "border-transparent text-slate-400 hover:border-slate-600 hover:bg-white/[0.03] hover:text-slate-200"
                  }`
                }
              >
                <Icon size={17} />
                <span className="font-medium tracking-wide">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/5 px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-['JetBrains_Mono'] text-[11px] text-slate-500">
              All systems synced
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}