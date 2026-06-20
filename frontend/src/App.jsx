import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";

// Import all required Recharts components
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  // 1. Navigation View State ("dashboard", "products", "customers", "orders")
  const [view, setView] = useState("dashboard");

  // Database placeholders for your metric cards
  const totalCustomers = 0;
  const totalOrders = 0;
  const totalProducts = 0;

  // Initialize the Embla Carousel engine hook
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: "start" 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync horizontal carousel slide indicators when user drags or swipes
  useEffect(() => {
    if (!emblaApi || view !== "dashboard") return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, view]);

  // Mock timeline database array
  const dashboardTimelineData = [
    { name: "Jan", sales: 4000, orders: 24, newCustomers: 12 },
    { name: "Feb", sales: 3000, orders: 18, newCustomers: 19 },
    { name: "Mar", sales: 5000, orders: 36, newCustomers: 26 },
    { name: "Apr", sales: 4780, orders: 30, newCustomers: 22 },
    { name: "May", sales: 6890, orders: 48, newCustomers: 35 },
    { name: "Jun", sales: 7390, orders: 52, newCustomers: 41 },
  ];

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
          {/* 2. Pass view states directly down into your Sidebar */}
          <AppSidebar currentView={view} setView={setView} />

          <main className="flex-1 p-8 overflow-x-hidden">
            <SidebarTrigger />

            {/* 3. CONDITIONAL RENDER: DASHBOARD VIEW */}
            {view === "dashboard" && (
              <>
                <header className="mt-6">
                  <h1 className="text-4xl font-bold tracking-tight">Inventory Dashboard</h1>
                  <p className="text-sm text-slate-500 mt-1">Real-time overview of your store statistics.</p>
                </header>

                {/* Metrics Layout Grid Block */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Customers</p>
                      <p className="text-3xl font-bold tracking-tight text-slate-900 mt-2">{totalCustomers.toLocaleString()}</p>
                    </div>
                    <div className="text-xs text-slate-400 mt-4 pt-2 border-t">Registered store accounts</div>
                  </div>

                  <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Orders</p>
                      <p className="text-3xl font-bold tracking-tight text-slate-900 mt-2">{totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="text-xs text-slate-400 mt-4 pt-2 border-t">Lifetime checkout counter</div>
                  </div>

                  <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Products</p>
                      <p className="text-3xl font-bold tracking-tight text-slate-900 mt-2">{totalProducts.toLocaleString()}</p>
                    </div>
                    <div className="text-xs text-slate-400 mt-4 pt-2 border-t">Active inventory catalog variants</div>
                  </div>
                </section>

                {/* Horizontal Scroll Chart Carousel Section */}
                <section className="mt-8 bg-white border rounded-xl p-6 shadow-sm">
                  <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-slate-900">Analytics Visualizations</h2>
                      <p className="text-xs text-slate-500">Swipe or scroll horizontally to toggle specific chart categories.</p>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-lg">
                      <button 
                        type="button"
                        onClick={() => emblaApi?.scrollTo(0)}
                        className={`text-xs px-2.5 py-1 font-medium rounded-md transition-all ${selectedIndex === 0 ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                      >
                        Revenue
                      </button>
                      <button 
                        type="button"
                        onClick={() => emblaApi?.scrollTo(1)}
                        className={`text-xs px-2.5 py-1 font-medium rounded-md transition-all ${selectedIndex === 1 ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                      >
                        Orders
                      </button>
                      <button 
                        type="button"
                        onClick={() => emblaApi?.scrollTo(2)}
                        className={`text-xs px-2.5 py-1 font-medium rounded-md transition-all ${selectedIndex === 2 ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                      >
                        Acquisition
                      </button>
                    </div>
                  </header>

                  <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
                    <div className="flex">
                      {/* SLIDE 1: AREA CHART */}
                      <div className="flex-[0_0_100%] min-w-0 h-80 px-2 select-none">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Chart 1: Gross Revenue ($)</span>
                        <ResponsiveContainer width="100%" height="90%">
                          <AreaChart data={dashboardTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(val) => [`$${val}`, "Revenue"]} />
                            <Area type="monotone" dataKey="sales" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* SLIDE 2: BAR CHART */}
                      <div className="flex-[0_0_100%] min-w-0 h-80 px-2 select-none">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Chart 2: Order Fulfillment Count</span>
                        <ResponsiveContainer width="100%" height="90%">
                          <BarChart data={dashboardTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(val) => [val, "Orders Placed"]} />
                            <Bar dataKey="orders" fill="#3b82f6" radius={4} maxBarSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* SLIDE 3: LINE CHART */}
                      <div className="flex-[0_0_100%] min-w-0 h-80 px-2 select-none">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Chart 3: Account Registrations</span>
                        <ResponsiveContainer width="100%" height="90%">
                          <LineChart data={dashboardTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </section></>)}
              </main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
  )}
