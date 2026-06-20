import { apiUrl } from "@/api/client";

export const createProduct = async (data) => {
  const res = await fetch(apiUrl("/products"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(responseData.detail || "Failed to create product");
  }

  return responseData;
};

export const getProducts = async () => {
  const res = await fetch(apiUrl("/products"));

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

export const deleteProduct = async (sku) => {
  const res = await fetch(apiUrl(`/products/sku/${encodeURIComponent(sku)}`), {
    method: "DELETE",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || "Failed to delete product");
  }

  return data;
};
