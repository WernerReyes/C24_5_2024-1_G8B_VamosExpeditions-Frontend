import {
  type ProgressBarProps,
  ProgressBar as ProgressBarPrimeReact,
} from "primereact/progressbar";

interface Props extends ProgressBarProps {}
export const ProgressBar = ({ ...props }: Props) => {
  return <ProgressBarPrimeReact {...props} />;
};
