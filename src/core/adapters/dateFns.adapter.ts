import { parseISO, format } from "date-fns";
import { toZonedTime } from 'date-fns-tz';

export const dateFnsAdapter = {
  parseISO(dateString: string) {
    const date = parseISO(dateString)
    return toZonedTime(date, 'UTC');
  },
  format(date: Date, pattern: string) {
    return format(date, pattern);
  },
};
