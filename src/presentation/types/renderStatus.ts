import type { Severity } from "./serverity";

export type RenderStatus<T> = {
  label: string;
  icon: string;
  severity: Severity;
  value: T;
};
