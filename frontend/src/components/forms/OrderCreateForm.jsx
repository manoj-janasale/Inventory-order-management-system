import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { createOrder } from "@/api/orders";

export default function OrderCreateForm({
  customers = [],
  products = [],
  onOrderCreated,
}) {
  const availableProducts = products.filter((product) => product.quantity > 0);
  const [customerId, setCustomerId] = useState("");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  const selectedItems = useMemo(() => {
    return availableProducts
      .map((product) => ({
        product,
        quantity: Number(quantities[product.id]) || 0,
      }))
      .filter((item) => item.quantity > 0);
  }, [availableProducts, quantities]);

  const totalAmount = selectedItems
    .reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
    .toFixed(2);

  const updateQuantity = (product, nextQuantity) => {
    const quantity = Math.min(
      product.quantity,
      Math.max(0, Number(nextQuantity) || 0)
    );

    setQuantities((current) => ({
      ...current,
      [product.id]: quantity,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      alert("Select a customer");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Select at least one product quantity");
      return;
    }

    try {
      setLoading(true);
      await createOrder({
        customer_id: Number(customerId),
        items: selectedItems.map((item) => ({
          product_id: Number(item.product.id),
          quantity: Number(item.quantity),
        })),
      });
      setCustomerId("");
      setQuantities({});
      await onOrderCreated?.();
      alert("Order processed successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
          Customer
        </label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
        >
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Products
          </label>
          <span className="text-xs font-semibold text-slate-700">
            Total ${totalAmount}
          </span>
        </div>

        <div className="border rounded-lg divide-y max-h-72 overflow-y-auto bg-white">
          {availableProducts.length === 0 && (
            <p className="text-sm text-slate-500 p-3">No products are currently in stock.</p>
          )}

          {availableProducts.map((product) => {
            const quantity = Number(quantities[product.id]) || 0;
            const lineTotal = (Number(product.price) * quantity).toFixed(2);

            return (
              <div
                key={product.id}
                className="grid grid-cols-[1fr_auto] gap-3 items-center p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {product.sku} | ${Number(product.price).toFixed(2)} | Stock: {product.quantity}
                  </p>
                  {quantity > 0 && (
                    <p className="text-xs font-medium text-slate-700 mt-1">
                      Line total ${lineTotal}
                    </p>
                  )}
                </div>

                <div className="flex items-center border rounded-lg bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product, quantity - 1)}
                    className="h-9 w-9 grid place-items-center hover:bg-slate-100"
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    <Minus size={15} />
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => updateQuantity(product, e.target.value)}
                    className="h-9 w-14 text-center bg-transparent text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(product, quantity + 1)}
                    className="h-9 w-9 grid place-items-center hover:bg-slate-100"
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || customers.length === 0 || availableProducts.length === 0}
        className="w-full bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Processing..." : "Process Order"}
      </button>
    </form>
  );
}
