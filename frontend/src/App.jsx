import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardView } from "@/components/DashBoardView";
import { AdminPanelLayout } from "@/components/AdminPanelLayout";
import { createCustomer, deleteCustomer } from "@/api/customers";
import { deleteProduct } from "@/api/products";
import { deleteOrder } from "@/api/orders";
import { apiUrl } from "@/api/client";

// forms
import ProductCreateForm from "@/components/forms/ProductCreateForm";
import OrderCreateForm from "@/components/forms/OrderCreateForm";
import CustomerCreateForm from "@/components/forms/CustomerCreateForm";
import DeleteRecordForm from "@/components/forms/DeleteRecordForm";

export default function App() {
  const [view, setView] = useState("dashboard");

  // REAL STATE
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // 🔄 FETCH PRODUCTS
  const refreshProducts = async () => {
    try {
      const res = await fetch(apiUrl("/products/"));
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };
  const refreshOrders = async () => {
  try {
    const res = await fetch(apiUrl("/orders/"));
    const data = await res.json();
    setOrders(data);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
  }
};

const refreshCustomers = async () => {
  try {
    const res = await fetch(apiUrl("/customers/"));
    const data = await res.json();
    setCustomers(data);
  } catch (err) {
    console.error("Failed to fetch customers:", err);
  }
};

  useEffect(() => {
    const timer = window.setTimeout(() => {
      Promise.all([refreshProducts(), refreshOrders(), refreshCustomers()]);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // ✅ FIX: mapper (IMPORTANT PART)
  const mapProductsToTable = (products) => {
    return products.map((p) => ({
      col1: p.sku,
      col2: p.name,
      col3: `$${p.price}`,
      col4: p.quantity > 0 ? `In Stock: ${p.quantity}` : "Out of Stock",
    }));
  };

  const mapCustomersToTable = (customers) => {
    return customers.map((c) => ({
      col1: c.id,
      col2: c.name,
      col3: c.email,
      col4: "Active",
    }));
  };

  const handleCreateCustomer = async (data) => {
  await createCustomer(data);
  await refreshCustomers();
  };

  const handleDeleteProduct = async (sku) => {
    await deleteProduct(sku);
    await refreshProducts();
  };

  const handleDeleteCustomer = async (customerId) => {
    await deleteCustomer(customerId);
    await refreshCustomers();
  };

  const handleDeleteOrder = async (orderId) => {
    await deleteOrder(orderId);
    await Promise.all([refreshOrders(), refreshProducts()]);
  };

  const handleOrderCreated = async () => {
    await Promise.all([refreshOrders(), refreshProducts()]);
  };

  const mapOrdersToTable = (orders) => {
    return orders.map((order) => ({
      col1: order.id,
      col2: `${order.customer_name} - ${
        order.items?.map((item) => `${item.product_name} x ${item.quantity}`).join(", ") ||
        `${order.product_name} x ${order.quantity}`
      }`,
      col3: `$${Number(order.total_amount).toFixed(2)}`,
      col4: order.status,
    }));
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-slate-50">

          <AppSidebar currentView={view} setView={setView} />

          <main className="flex-1 p-8">
            <SidebarTrigger />

            {/* DASHBOARD */}
            {view === "dashboard" && (
              <DashboardView
                totalCustomers={customers.length}
                totalOrders={orders.length}
                totalProducts={products.length}
              />
            )}

            {/* PRODUCTS */}
            {view === "products" && (
              <AdminPanelLayout
                title="Products Catalog"
                description="Manage inventory items"
                countLabel="Total Products"
                countValue={products.length}
                tableHeaders={["SKU", "Name", "Price", "Stock"]}

                // ✅ FIXED HERE
                tableRows={mapProductsToTable(products)}

                createForm={
                  <ProductCreateForm refreshProducts={refreshProducts} products={products} />
                }
                deleteForm={
                  <DeleteRecordForm
                    label="Product"
                    fieldLabel="Product SKU"
                    placeholder="e.g. PROD-1001"
                    inputType="text"
                    onDelete={handleDeleteProduct}
                  />
                }
              />
            )}

            {/* ORDERS */}
            {view === "orders" && (
              <AdminPanelLayout
                title="Orders"
                description="Manage all orders"
                countLabel="Total Orders"
                countValue={orders.length}
                tableHeaders={["Order ID", "Customer & Product", "Amount", "Status"]}
                tableRows={mapOrdersToTable(orders)}
                createForm={
                  <OrderCreateForm
                    customers={customers}
                    products={products}
                    onOrderCreated={handleOrderCreated}
                  />
                }
                deleteForm={
                  <DeleteRecordForm
                    label="Order"
                    placeholder="e.g. 23"
                    onDelete={handleDeleteOrder}
                  />
                }
              />
            )}

            {/* CUSTOMERS */}
            {view === "customers" && (
              <AdminPanelLayout
                title="Customers"
                description="Customer database"
                countLabel="Total Customers"
                countValue={customers.length}
                tableHeaders={["ID", "Name", "Email", "Status"]}
                tableRows={mapCustomersToTable(customers)}
                createForm={
                  <CustomerCreateForm onCreate={handleCreateCustomer} customers={customers}/>
                }
                deleteForm={
                  <DeleteRecordForm
                    label="Customer"
                    placeholder="e.g. 7"
                    onDelete={handleDeleteCustomer}
                  />
                }
              />
            )}

          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
