import {
  Calendar as CalendarPrimeReact,
  type CalendarProps,
} from "primereact/calendar";
import { addLocale, type LocaleOptions } from "primereact/api";
import { HTMLAttributes, LabelHTMLAttributes } from 'react';



type Props = CalendarProps & {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?:HTMLAttributes<HTMLElement> & { text?: string };
};

export const Calendar = ({ locale,small,label, ...props }: Props) => {
  if (locale === "es") addLocale("es", spanishLocaleOptions);


  return (
    <>
      {label ? (
        <label {...label}>
          {label.text}
        </label>
      ):null}
      <CalendarPrimeReact

        {...props}
        locale={locale}
        showIcon
      />
      {small ? (
        <small {...small}>{small.text}</small>
      ) : null}
    </>
  );
   
};

const spanishLocaleOptions: LocaleOptions & { showMonthAfterYear: boolean } = {
  firstDayOfWeek: 1,
  showMonthAfterYear: true,
  dayNames: [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ],
  dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
  dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
  monthNames: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ],
  monthNamesShort: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ],
  today: "Hoy",
  clear: "Limpiar",
};
