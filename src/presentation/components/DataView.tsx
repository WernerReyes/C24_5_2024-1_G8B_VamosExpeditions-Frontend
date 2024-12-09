import {
  DataView as DataViewPrimeReact,
  type DataViewProps,
  DataViewLayoutOptions,
} from "primereact/dataview";

interface Props extends DataViewProps {}

export const DataView = (props: Props) => {
  return <DataViewPrimeReact {...props} />;
};

export { DataViewLayoutOptions };
