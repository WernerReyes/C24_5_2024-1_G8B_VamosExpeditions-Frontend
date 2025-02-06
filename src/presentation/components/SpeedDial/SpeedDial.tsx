import {
  SpeedDial as SpeedDialPrimeReact,
  type SpeedDialProps,
} from "primereact/speeddial";

import "./SpeedDial.css";

interface Props extends SpeedDialProps {}

export const SpeedDial = ({ ...props }: Props) => {
  return (
    <SpeedDialPrimeReact
      {...props}
      pt={{
        menu: {
          className: "max-h-[calc(100vh-11rem)]",
        },
        ...props.pt,
      }}
    />
  );
};
