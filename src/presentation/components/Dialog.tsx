import { cn } from "@/core/adapters";
import { constantResponsiveDesignArrayString } from "@/core/constants";
import {
  Dialog as DialogPrimeReact,
  type DialogProps,
} from "primereact/dialog";
import { useWindowSize } from "../hooks";

type Breakpoints = (typeof constantResponsiveDesignArrayString)[number];

const BREAKPOINTS: Record<Breakpoints, string> = {
  "1920px": "50vw",
  "1440px": "75vw",
  "1024px": "75vw",
  "768px": "100vw",
  "320px": "100vw",
};


interface Props extends DialogProps {}

export const Dialog = ({ maximizable, maximized, ...props }: Props) => {
  const { width, TABLET } = useWindowSize();
  return (
    <DialogPrimeReact
      
      {...props}
      contentClassName={cn(
        "thin-scrollbar flex flex-col justify-between",
        props.contentClassName
      )}
      breakpoints={BREAKPOINTS}
      onMaximize={() => {
        if (width < TABLET) {
          props.onHide?.();
        }
      }}
      maximized={width < TABLET ? true : maximized}
      maximizable={width < TABLET ? false : maximizable}
      maximizeIcon={width < TABLET && "unmaximize"}
    />
  );
};
