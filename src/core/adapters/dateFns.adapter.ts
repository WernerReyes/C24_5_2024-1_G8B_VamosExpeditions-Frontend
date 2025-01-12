import { parseISO, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

type FormatDateType = "dd/MM/yyyy" | "dd/MM/yyyy HH:mm" | "yyyy-MM-dd";

export const dateFnsAdapter = {
  parseISO(dateString: string) {
    const date = parseISO(dateString);
    return toZonedTime(date, "UTC");
  },
  format(value: Date, pattern: FormatDateType = "dd/MM/yyyy"): string {
    let date;
    if (typeof value === "string") {
      date = dateFnsAdapter.parseISO(value);
    } else {
      date = value;
    }
    return format(date, pattern);
  },
};
