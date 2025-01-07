import { Skeleton as SkeletonPrimeReact, type SkeletonProps as SkeletonPropsPrimeReact } from "primereact/skeleton";

export interface SkeletonProps extends SkeletonPropsPrimeReact {}

export const Skeleton= (props: SkeletonProps) => {
  return <SkeletonPrimeReact {...props} />;
};