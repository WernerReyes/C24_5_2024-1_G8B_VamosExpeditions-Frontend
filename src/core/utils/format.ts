import { dateFnsAdapter } from "../adapters";

type FormatDateType = "dd/MM/yyyy" | "dd/MM/yyyy HH:mm" | "yyyy-MM-dd";

export const formatDate = (
  value: Date,
  format: FormatDateType = "dd/MM/yyyy"
): string => {
  let date;
  if (typeof value === "string") {
    date = dateFnsAdapter.parseISO(value);
  } else {
    date = value;
  }
  const formattedDate = dateFnsAdapter.format(date, format);
  return formattedDate;
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString("es-US", {
    style: "currency",
    currency: "USD",
  });
};
