import {
  parseISO,
  format,
  parse,
  isSameDay,
  isWithinInterval,
  getHours,
  eachDayOfInterval,
} from "date-fns";
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
  parseISO(dateString: string | Date): Date {
    if (dateString instanceof Date) {
      return toZonedTime(dateString, "UTC");
    } else {
      const date = parseISO(dateString);
      return toZonedTime(date, "UTC");
    }
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
    return format(date, pattern, {
      locale: es,
    });
  },

  isSameDay(date1: Date | string, date2: Date | string): boolean {
    const dateFormat =
      typeof date1 === "string" ? dateFnsAdapter.parseISO(date1) : date1;
    const dateFormat2 =
      typeof date2 === "string" ? dateFnsAdapter.parseISO(date2) : date2;
    return isSameDay(dateFormat, dateFormat2);
  },

  getHours(date: Date = new Date()): number {
    return getHours(date);
  },

  isWithinInterval(date: Date, startDate: Date, endDate: Date): boolean {
    return isWithinInterval(date, { start: startDate, end: endDate });
  },

  eachDayOfInterval(startDate: Date, endDate: Date): Date[] {
    return eachDayOfInterval({
      start: dateFnsAdapter.parseISO(startDate),
      end: dateFnsAdapter.parseISO(endDate),
    });
  },
};
