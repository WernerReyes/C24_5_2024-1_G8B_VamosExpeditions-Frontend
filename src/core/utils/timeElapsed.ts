import { DateTime } from "luxon";

const timeElapsed = (fechaInicio: Date, fechaFin: Date) => {
  const inicio = DateTime.fromJSDate(fechaInicio).setZone("America/Lima");
  const fin = DateTime.fromJSDate(fechaFin).setZone("America/Lima");
  const duracion = fin
    .diff(inicio, ["years", "months", "days", "hours", "minutes", "seconds"])
    .toObject();

  return {
    años: duracion.years ?? 0,
    meses: duracion.months ?? 0,
    dias: duracion.days ?? 0,
    horas: duracion.hours ?? 0,
    minutos: duracion.minutes ?? 0,
    segundos: Math.floor(duracion?.seconds ?? 0),
  };
};

export const messageTimestamp = (fechaInicio: Date): string => {
  const { horas, minutos, meses, dias, años } = timeElapsed(
    new Date(fechaInicio),
    new Date()
  );

  let mensaje = "Hace ";
  if (años > 0) {
    mensaje += `${años} año${años > 1 ? "s" : ""}`;
  } else if (meses > 0) {
    mensaje += `${meses} mes${meses > 1 ? "es" : ""}`;
  } else if (dias > 0) {
    mensaje += `${dias} día${dias > 1 ? "s" : ""}`;
  } else if (horas > 0) {
    mensaje += `${horas} hora${horas > 1 ? "s" : ""}`;
  } else if (minutos > 0) {
    mensaje += `${minutos} minuto${minutos > 1 ? "s" : ""}`;
  } else {
    mensaje += "Algunos segundos";
  }

  return mensaje;
};
