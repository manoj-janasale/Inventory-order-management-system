import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function DashboardView({
  totalCustomers,
  totalOrders,
  totalProducts,
  customers = [],
  orders = [],
  products = [],
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const chartLabel = (value, fallback) => {
    const label = String(value || fallback);
    return label.length > 14 ? `${label.slice(0, 12)}...` : label;
  };

  const productChartData = products.slice(0, 12).map((product) => ({
    name: chartLabel(product.sku || product.name, `P-${product.id}`),
    stock: Number(product.quantity) || 0,
  }));

  const orderChartData = orders.slice(0, 12).reverse().map((order) => ({
    name: `#${order.id}`,
    amount: Number(order.total_amount) || 0,
    quantity: Number(order.quantity) || 0,
  }));

  const customerChartData = customers.slice(0, 12).reverse().map((customer, index) => ({
    name: chartLabel(customer.name, `C-${customer.id}`),
    customers: index + 1,
  }));

  return (
    <div className="animate-in fade-in duration-200">
      <header className="mt-6">
        <h1 className="text-4xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time overview of your store statistics.</p>
      </header>

      {/* Grid Layout Cards */}
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

      {/* Horizontal Charts Block */}
      <section className="mt-8 bg-white border rounded-xl p-6 shadow-sm">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Analytics Visualizations</h2>
            <p className="text-xs text-slate-500">Swipe or scroll horizontally to toggle specific chart categories.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button type="button" onClick={() => emblaApi?.scrollTo(0)} className={`text-xs px-2.5 py-1 font-medium rounded-md transition-all ${selectedIndex === 0 ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Products</button>
            <button type="button" onClick={() => emblaApi?.scrollTo(1)} className={`text-xs px-2.5 py-1 font-medium rounded-md transition-all ${selectedIndex === 1 ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Orders</button>
            <button type="button" onClick={() => emblaApi?.scrollTo(2)} className={`text-xs px-2.5 py-1 font-medium rounded-md transition-all ${selectedIndex === 2 ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Customers</button>
          </div>
        </header>

        <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
          <div className="flex">
            <div className="flex-[0_0_100%] min-w-0 h-80 px-2 select-none">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Chart 1: Product Stock</span>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={productChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="productGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.18}/>
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(val) => [val, "Available Stock"]} />
                  <Area type="monotone" dataKey="stock" stroke="#0f766e" strokeWidth={2} fillOpacity={1} fill="url(#productGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-[0_0_100%] min-w-0 h-80 px-2 select-none">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Chart 2: Order Amounts</span>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={orderChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(val, name) => [name === "amount" ? `$${val}` : val, name === "amount" ? "Order Amount" : "Items"]} />
                  <Bar dataKey="amount" fill="#2563eb" radius={4} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-[0_0_100%] min-w-0 h-80 px-2 select-none">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Chart 3: Customers</span>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={customerChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(val) => [val, "Customer Count"]} />
                  <Line type="monotone" dataKey="customers" stroke="#16a34a" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  ); // <-- Corrected closing tag structures here
}
