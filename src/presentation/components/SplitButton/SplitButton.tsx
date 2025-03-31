import { useWindowSize } from "@/presentation/hooks";
import {
  SplitButton as SplitButtonPrimeReact,
  type SplitButtonProps,
} from "primereact/splitbutton";

import "./SplitButton.css";
import { type SkeletonProps, Skeleton } from "..";

interface Props extends SplitButtonProps {
  skeleton?: SkeletonProps;
}

export const SplitButton = ({ size, loading, skeleton, ...props }: Props) => {
  const { width, TABLET } = useWindowSize();
  return (
    <>
      {loading && skeleton ? (
        
        <Skeleton
          shape="rectangle"
          height="3rem"
          {...skeleton}
          width={width < TABLET ? "100%" : skeleton.width}
        />
      ) : (
        <SplitButtonPrimeReact
          {...props}
          size={size ?? width < TABLET ? "small" : undefined}
        />
      )}
    </>
  );
};
