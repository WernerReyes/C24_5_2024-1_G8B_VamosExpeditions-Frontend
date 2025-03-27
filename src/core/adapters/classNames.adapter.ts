import { classNames } from "primereact/utils";

export const cn = (...args: any[]): string | undefined => {
  return classNames(...args);
};
