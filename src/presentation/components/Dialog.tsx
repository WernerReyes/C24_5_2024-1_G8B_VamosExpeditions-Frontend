import {
  Dialog as DialogPrimeReact,
  type DialogProps,
} from "primereact/dialog";
import { useWindowSize } from "../hooks";
import { constantResponsiveDesignArray } from "@/core/constants";
import { cn } from "@/core/adapters";

type Breakpoints = (typeof constantResponsiveDesignArray)[number];

const BREAKPOINTS: Record<Breakpoints, string> = {
  "1920": "50vw",
  "1440": "75vw",
  "1024": "75vw",
  "768": "100vw",
  "320": "100vw",
};

const getBreakpoints = (width: number): string => {
  return BREAKPOINTS[
    constantResponsiveDesignArray.find((bp) => bp >= width) ?? 0
  ];
};

interface Props extends DialogProps {}

export const Dialog = ({ ...props }: Props) => {
  const { width, TABLET } = useWindowSize();
  return (
    <DialogPrimeReact
      style={{
        width: getBreakpoints(width),
        height: "100vh",
        ...props.style,
      }}
      {...props}
      contentClassName={cn(
        "thin-scrollbar flex flex-col justify-between",
        props.contentClassName
      )}
      maximized={width < TABLET ? true : props.maximized}
      maximizable={width < TABLET ? false : props.maximizable}
      maximizeIcon={width < TABLET && "unmaximize"}
    />
  );
};
