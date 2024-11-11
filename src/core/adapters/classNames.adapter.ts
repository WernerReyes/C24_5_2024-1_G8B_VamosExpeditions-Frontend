import { classNames } from "primereact/utils";

export const classNamesAdapter = (...args: any[]): string | undefined => {
  return classNames(...args);
};
