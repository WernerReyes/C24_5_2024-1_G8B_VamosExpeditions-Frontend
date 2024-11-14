import {
  MultiSelect as MultiSelectPrimeReact,
  type MultiSelectProps,
  type MultiSelectChangeEvent
} from "primereact/multiselect";

interface Props extends MultiSelectProps {}

export const MultiSelect = (props: Props) => {
  return <MultiSelectPrimeReact {...props} />;
};

export type { MultiSelectChangeEvent };
