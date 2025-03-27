export const formatCurrency = (value: number): string => {
  return Number(value).toLocaleString("es-US", {
    style: "currency",
    currency: "USD",
  });
};
