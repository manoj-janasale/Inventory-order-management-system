import { useState } from "react";

export default function DeleteRecordForm({
  label,
  fieldLabel,
  placeholder,
  inputType = "number",
  onDelete,
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      alert(`Enter a valid ${fieldLabel || `${label} ID`}`);
      return;
    }

    const deleteValue = inputType === "number" ? Number(trimmedValue) : trimmedValue;
    if (inputType === "number" && (!deleteValue || deleteValue <= 0)) {
      alert(`Enter a valid ${fieldLabel || `${label} ID`}`);
      return;
    }

    try {
      setLoading(true);
      await onDelete(deleteValue);
      setValue("");
      alert(`${label} deleted successfully`);
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
          {fieldLabel || `${label} ID`}
        </label>
        <input
          type={inputType}
          min={inputType === "number" ? "1" : undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Deleting..." : `Delete ${label}`}
      </button>
    </form>
  );
}
