import { parseISO, format } from "date-fns";

export const dateFnsAdapter = {
  parse(date: string) {
    return parseISO(date);
  },
  format(date: Date, pattern: string) {
    return format(date, pattern);
  },
};
