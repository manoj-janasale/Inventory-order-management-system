import { useState } from "react";

export default function CustomerCreateForm({ onCreate, customers = [] }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ❌ 1. empty check
  if (!form.name.trim() || !form.email.trim()) {
    alert("Please fill all fields");
    return;
  }

  // ❌ 2. duplicate email check
  const isDuplicate = customers?.some(
    (c) => c.email.toLowerCase() === form.email.trim().toLowerCase()
  );

  if (isDuplicate) {
    alert("This email is already registered");
    return;
  }

  try {
    await onCreate({
      name: form.name.trim(),
      email: form.email.trim(),
    });

    setForm({ name: "", email: "" });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
          Full Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors"
      >
        Register Customer
      </button>

    </form>
  );
}
