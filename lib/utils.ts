export function formatPrice(price: number | string) {
  return `₦${Number(price).toLocaleString("en-NG")}`;
}

export function createTrackingId() {
  const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `ZNX-${Date.now().toString(36).toUpperCase()}-${random}`;
}

export function cleanText(value: unknown) {
  if (typeof value !== "string") return "";

  return value.trim();
}
