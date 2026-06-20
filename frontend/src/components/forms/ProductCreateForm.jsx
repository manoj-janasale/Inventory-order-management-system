import { useState } from "react";
import { createProduct } from "@/api/products";

export default function ProductCreateForm({ refreshProducts, products = [] }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const price = Number(form.price);
  const quantity = Number(form.quantity);

  // ❌ 1. Negative validation
  if (!form.name.trim() || !form.sku.trim() || !form.price || !form.quantity) {
    alert("Please fill all fields");
    return;
  }

  if (price <= 0 || quantity < 0) {
    alert("Price must be positive and quantity cannot be negative");
    return;
  }

  const isDuplicate = products?.some(
    (p) => p.sku.toLowerCase() === form.sku.trim().toLowerCase()
  );

  if (isDuplicate) {
    alert("Duplicate SKU used. Please enter a unique SKU.");
    return;
  }

  try {
    setLoading(true);

    await createProduct({
      name: form.name,
      sku: form.sku.trim(),
      price,
      quantity,
    });

    setForm({
      name: "",
      sku: "",
      price: "",
      quantity: "",
    });

    refreshProducts?.();
  } catch (err) {
    console.error("Failed to create product:", err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Product Name */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
          Product Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Wireless Headphones"
          className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
        />
      </div>

      {/* SKU */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
          SKU
        </label>
        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="e.g. PROD-1001"
          className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
        />
      </div>

      {/* Price + Quantity */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
            Price
          </label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="99.99"
            className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
            Quantity
          </label>
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="10"
            className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
          />
        </div>

      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>

    </form>
  );
}
