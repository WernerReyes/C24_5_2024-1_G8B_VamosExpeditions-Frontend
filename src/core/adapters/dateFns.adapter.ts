import { parseISO, format, parse, isSameDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale/es";

type FormatDateType =
  | "dd/MM/yyyy"
  | "dd/MM/yyyy HH:mm"
  | "yyyy-MM-dd"
  | "EEEE, d 'de' MMMM 'de' yyyy";

export const dateFnsAdapter = {
  parse(dateString: string, pattern: FormatDateType = "dd/MM/yyyy"): Date {
    const date = parse(dateString, pattern, new Date(), {
      locale: es,
    });
    return toZonedTime(date, "UTC");
  },
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

  isSameDay(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
  }
};
