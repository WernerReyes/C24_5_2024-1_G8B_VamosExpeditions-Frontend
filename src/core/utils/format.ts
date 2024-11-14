import { dateFnsAdapter } from "../adapters";

export const formatDate = (value: Date): string => {
  let date;
  if (typeof value === "string") {
    date = dateFnsAdapter.parse(value);
  } else {
    date = value;
  }
  const formattedDate = dateFnsAdapter.format(date, "dd/MM/yyyy");
  return formattedDate;
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString("es-US", {
    style: "currency",
    currency: "USD",
  });
};
