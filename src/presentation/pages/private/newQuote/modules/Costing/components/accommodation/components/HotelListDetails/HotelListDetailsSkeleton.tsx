import { Skeleton } from "@/presentation/components";

export const HotelListDetailsSkeleton = () => {
  return (
    <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <Skeleton
            shape="rectangle"
            width="60px"
            height="20px"
            className="rounded-lg"
          />
          <Skeleton shape="circle" size="24px" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2">
            <Skeleton shape="circle" size="40px" />
            <div>
              <Skeleton
                shape="rectangle"
                width="140px"
                height="16px"
                className="mb-2"
              />
              <Skeleton shape="rectangle" width="100px" height="12px" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Grid */}
        <div className="grid gap-6 grid-cols-2">
          <div className="space-y-1">
            <Skeleton shape="rectangle" width="80px" height="16px" />
            <Skeleton
              shape="rectangle"
              width="60px"
              height="20px"
              className="font-semibold"
            />
          </div>
          <div className="space-y-1">
            <Skeleton shape="rectangle" width="80px" height="16px" />
            <Skeleton
              shape="rectangle"
              width="60px"
              height="20px"
              className="font-semibold"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <Skeleton shape="rectangle" width="80px" height="16px" />
            <Skeleton
              shape="rectangle"
              width="60px"
              height="20px"
              className="text-2xl font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
