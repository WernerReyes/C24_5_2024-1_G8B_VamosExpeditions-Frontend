import { Card, Skeleton } from "@/presentation/components";

export const ItemSkeleton = () => {
  return (
    <Card>
      <div className="flex items-center space-x-4">
        <Skeleton shape="circle" size="3rem" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="1rem" />
          <Skeleton width="40%" height="0.75rem" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton width="4rem" height="1rem" />
          <Skeleton width="5rem" height="1.2rem" className="mt-2" />
        </div>
      </div>
    </Card>
  );
};
