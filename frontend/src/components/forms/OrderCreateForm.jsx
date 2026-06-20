import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { createOrder } from "@/api/orders";

export default function OrderCreateForm({
  customers = [],
  products = [],
  onOrderCreated,
}) {
  const availableProducts = products.filter((product) => product.quantity > 0);
  const [form, setForm] = useState({
    customerId: "",
    productId: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === String(form.productId)),
    [products, form.productId]
  );

  const totalAmount = selectedProduct
    ? (Number(selectedProduct.price) * Number(form.quantity)).toFixed(2)
    : "0.00";

  const updateQuantity = (nextQuantity) => {
    const quantity = Math.max(1, Number(nextQuantity) || 1);
    setForm((current) => ({ ...current, quantity }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerId || !form.productId) {
      alert("Select a customer and product");
      return;
    }

    if (selectedProduct && form.quantity > selectedProduct.quantity) {
      alert(`Only ${selectedProduct.quantity} units are available for ${selectedProduct.name}`);
      return;
    }

    try {
      setLoading(true);
      await createOrder({
        customer_id: Number(form.customerId),
        product_id: Number(form.productId),
        quantity: Number(form.quantity),
      });
      setForm({ customerId: "", productId: "", quantity: 1 });
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
          value={form.customerId}
          onChange={(e) => setForm({ ...form, customerId: e.target.value })}
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
        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
          Product
        </label>
        <select
          value={form.productId}
          onChange={(e) =>
            setForm({ ...form, productId: e.target.value, quantity: 1 })
          }
          className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
        >
          <option value="">Select product</option>
          {availableProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.sku}) - ${Number(product.price).toFixed(2)} - Stock: {product.quantity}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
            Quantity
          </label>
          <div className="flex items-center border rounded-lg bg-slate-50 overflow-hidden">
            <button
              type="button"
              onClick={() => updateQuantity(form.quantity - 1)}
              className="h-10 w-10 grid place-items-center hover:bg-slate-100"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => updateQuantity(e.target.value)}
              className="h-10 w-full min-w-0 text-center bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => updateQuantity(form.quantity + 1)}
              className="h-10 w-10 grid place-items-center hover:bg-slate-100"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="border rounded-lg px-4 py-2 bg-slate-50 min-w-32">
          <p className="text-[10px] font-semibold text-slate-500 uppercase">Total</p>
          <p className="text-sm font-bold text-slate-900">${totalAmount}</p>
        </div>
      </div>

      {selectedProduct && (
        <p className="text-xs text-slate-500">
          Unit price ${Number(selectedProduct.price).toFixed(2)}. Available stock: {selectedProduct.quantity}.
        </p>
      )}

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
