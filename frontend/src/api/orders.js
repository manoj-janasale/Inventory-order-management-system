const BASE_URL = "http://localhost:8000";

export const createOrder = async (data) => {
  const res = await fetch(`${BASE_URL}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(responseData.detail || "Failed to create order");
  }

  return responseData;
};

export const deleteOrder = async (orderId) => {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "DELETE",
  });

  const responseData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(responseData.detail || "Failed to delete order");
  }

  return responseData;
};
