import { apiUrl } from "@/api/client";

export const createCustomer = async (data) => {
  const res = await fetch(apiUrl("/customers/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(responseData.detail || "Failed to create customer");
  }

  return responseData;
};

export const deleteCustomer = async (customerId) => {
  const res = await fetch(apiUrl(`/customers/${customerId}`), {
    method: "DELETE",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || "Failed to delete customer");
  }

  return data;
};
