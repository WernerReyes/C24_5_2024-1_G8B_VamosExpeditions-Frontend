import {
  Calendar as CalendarPrimeReact,
  type CalendarProps,
} from "primereact/calendar";

type Props = CalendarProps & {};

export const Calendar = (props: Props) => {
  return <CalendarPrimeReact {...props} />;
};
