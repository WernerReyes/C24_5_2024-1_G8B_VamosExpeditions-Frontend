import {
  Calendar as CalendarPrimeReact,
  type CalendarProps,
} from "primereact/calendar";
import { addLocale, type LocaleOptions } from "primereact/api";
import type { HTMLAttributes, LabelHTMLAttributes } from "react";

import "./Calendar.css";
import { Skeleton, type SkeletonProps } from "..";
import { useWindowSize } from "@/presentation/hooks";

type Props = CalendarProps & {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
  loading?: boolean;
  skeleton?: SkeletonProps;
};

export const Calendar = ({
  locale,
  small,
  label,
  loading,
  skeleton,
  ...props
}: Props) => {
  const { width, TABLET } = useWindowSize();
  if (locale === "es") addLocale("es", spanishLocaleOptions);

  return (
    <>
      {label && <label {...label}>{label.text}</label>}
      {loading ? (
        <Skeleton
          shape="rectangle"
          height="3rem"
          {...skeleton}
          width={width < TABLET ? "100%" : skeleton?.width}
        />
      ) : (
        <CalendarPrimeReact
          locale={locale}
          {...props}
          numberOfMonths={props.numberOfMonths ? width < TABLET ? 1 : props.numberOfMonths : 1}
        />
      )}
      {small ? <small {...small}>{small.text}</small> : null}
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
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
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
