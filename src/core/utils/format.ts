export const formatCurrency = (value: number): string => {
  return value.toLocaleString("es-US", {
    style: "currency",
    currency: "USD",
  });
};
