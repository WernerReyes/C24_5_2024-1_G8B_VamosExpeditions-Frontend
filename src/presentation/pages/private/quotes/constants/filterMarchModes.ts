import type { ColumnFilterMatchModeOptions } from "@/presentation/components";

export const FILTER_MATCH_MODES: ColumnFilterMatchModeOptions[] = [
  {
    label: "Igual a",
    value: "equals",
  },
  {
    label: "Contiene",
    value: "contains",
  },
  {
    label: "Empieza con",
    value: "startsWith",
  },
  {
    label: "Termina con",
    value: "endsWith",
  },
];