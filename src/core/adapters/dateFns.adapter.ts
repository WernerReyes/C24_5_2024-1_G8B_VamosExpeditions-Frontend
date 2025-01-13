import { parseISO, format } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

type FormatDateType = "dd/MM/yyyy" | "dd/MM/yyyy HH:mm" | "yyyy-MM-dd";

export const dateFnsAdapter = {
  parseISO(dateString: string) {
    const date = parseISO(dateString);
    return toZonedTime(date, "UTC");
  },
  toISO(date: Date): string {
    // Convert a date to the specified timezone, then format as ISO 8601
    return fromZonedTime(date, "UTC").toISOString();
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
