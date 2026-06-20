import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardView } from "@/components/DashBoardView";
import { AdminPanelLayout } from "@/components/AdminPanelLayout";

export default function App() {
  const [view, setView] = useState("dashboard");

  // Mock database counts — replace with live backend variable references later
  const totalCustomers = 450;
  const totalOrders = 1240;
  const totalProducts = 89;

  // Mock database arrays for rendering tables (Limited to recent entries)
  const productData = Array.from({ length: 100 }, (_, i) => ({
    col1: `PROD-${1000 + i}`,
    col2: i === 0 ? "Leather Running Shoes" : `Product Variant Mock #${i + 1}`,
    col3: `$${(49.99 + i * 2).toFixed(2)}`,
    col4: i % 4 === 0 ? "Out of Stock" : "In Stock",
  }));

  const orderData = Array.from({ length: 100 }, (_, i) => ({
    col1: `ORD-${5000 + i}`,
    col2: `Customer User #${20 + i}`,
    col3: `$${(120.00 + i).toFixed(2)}`,
    col4: i % 3 === 0 ? "Processing" : "Delivered",
  }));

  const customerData = Array.from({ length: 100 }, (_, i) => ({
    col1: `CUST-${800 + i}`,
    col2: `User Name Alpha ${i + 1}`,
    col3: `user.${i}@storefront.com`,
    col4: "Active Member",
  }));

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
          <AppSidebar currentView={view} setView={setView} />

          <main className="flex-1 p-8 overflow-x-hidden">
            <SidebarTrigger />

            {/* View Switcher Routing Logic */}
            {view === "dashboard" && (
              <DashboardView 
                totalCustomers={totalCustomers} 
                totalOrders={totalOrders} 
                totalProducts={totalProducts} 
              />
            )}

            {view === "products" && (
              <AdminPanelLayout
                title="Products Catalog"
                description="Manage inventory items, stock counts, and system price catalogs."
                countLabel="Total Store Products"
                countValue={totalProducts}
                tableHeaders={["Product SKU", "Item Title", "Retail Price", "Stock Status"]}
                tableRows={productData}
                createForm={
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Product Title</label>
                      <input type="text" placeholder="e.g. Wireless Smart Speaker" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Price ($)</label>
                        <input type="number" placeholder="99.99" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Initial Inventory</label>
                        <input type="number" placeholder="50" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                      </div>
                    </div>
                    <button type="button" className="w-full bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors">
                      Add Product to Database
                    </button>
                  </div>
                }
                deleteForm={
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Target Product SKU ID</label>
                      <input type="text" placeholder="e.g. PROD-1004" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                    </div>
                    <p className="text-xs text-red-500">Warning: This action completely wipes the record from the catalog database logs permanently.</p>
                    <button type="button" className="w-full bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Delete Product Record
                    </button>
                  </div>
                }
              />
            )}

            {view === "orders" && (
              <AdminPanelLayout
                title="Order Management logs"
                description="Monitor global user shipments, checkout parameters, and shipping statuses."
                countLabel="Active Placed Orders"
                countValue={totalOrders}
                tableHeaders={["Order Reference", "Purchaser Name", "Total Bill Value", "Fulfillment Status"]}
                tableRows={orderData}
                createForm={
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Customer Identifier</label>
                      <input type="text" placeholder="e.g. CUST-802" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Total Checkout Amount</label>
                      <input type="number" placeholder="149.50" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                    </div>
                    <button type="button" className="w-full bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors">
                      Manually Generate Order
                    </button>
                  </div>
                }
                deleteForm={
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Target Order ID</label>
                      <input type="text" placeholder="e.g. ORD-5022" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                    </div>
                    <button type="button" className="w-full bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Cancel & Delete Order
                    </button>
                  </div>
                }
              />
            )}

            {view === "customers" && (
              <AdminPanelLayout
                title="Customer Database Profiles"
                description="Review consumer account registries, access permissions, and profiles."
                countLabel="Registered Buyer Accounts"
                countValue={totalCustomers}
                tableHeaders={["Customer ID", "Full Profile Name", "Email Address", "Membership status"]}
                tableRows={customerData}
                createForm={
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Full Name</label>
                      <input type="text" placeholder="e.g. Alice Smith" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Email Address</label>
                      <input type="email" placeholder="alice@example.com" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                    </div>
                    <button type="button" className="w-full bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors">
                      Register Customer Account
                    </button>
                  </div>
                }
                deleteForm={
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Target Customer ID</label>
                      <input type="text" placeholder="e.g. CUST-805" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
                    </div>
                    <button type="button" className="w-full bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Ban & Wipe Account
                    </button>
                  </div>
                }
              />
            )}

          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
