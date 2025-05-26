import {
  type VersionQuotationEntity,
  VersionQuotationStatus,
} from "@/domain/entities";

export const calculateCompletionPercentage = (
  currentStep: number,
  currentTripDetails: boolean,
  hotelRoomTripDetails: boolean,
  versionQuotation: VersionQuotationEntity,
  currentCompletionPercentage: number
) => {
  let newPercentage = currentCompletionPercentage; // Preserve current percentage

  // Increase logic
  if (currentStep >= 1 && currentTripDetails) {
    newPercentage = Math.max(newPercentage, 25);
  }
  if (currentStep >= 2 && currentTripDetails && hotelRoomTripDetails) {
    newPercentage = Math.max(newPercentage, 50);
  }

  if (
    currentStep >= 3 &&
    currentTripDetails &&
    hotelRoomTripDetails &&
    versionQuotation.indirectCostMargin
  ) {
    newPercentage = Math.max(newPercentage, 75);
  }

  if (versionQuotation.finalPrice) {
    newPercentage = Math.max(newPercentage, 100);
  }

  // Decrease logic (only when data is removed)
  if (!versionQuotation.finalPrice && newPercentage > 75) {
    newPercentage = 75; // Drop back if no final price
  }
  if (!versionQuotation.indirectCostMargin && newPercentage > 50) {
    newPercentage = 50; // Drop back if no indirect cost margin
  }

  if (!hotelRoomTripDetails && newPercentage > 25) {
    newPercentage = 25; // Drop back if no hotel details exist
  }
  if (!currentTripDetails && newPercentage > 0) {
    newPercentage = 0; // Drop to 0% if trip details are gone
  }

  return newPercentage;
};

export const getVersionDataAndCalculateCompletionPercentage = (
  versionQuotation: VersionQuotationEntity,
  currentCompletionPercentage: number
): VersionQuotationEntity => {
  switch (currentCompletionPercentage) {
    case 25:
      return {
        ...versionQuotation,
        status: VersionQuotationStatus.DRAFT,
        finalPrice: null,
        profitMargin: null,
        indirectCostMargin: null,
        completionPercentage: 25,
      };
    case 50:
      return {
        ...versionQuotation,
        status: VersionQuotationStatus.DRAFT,
        finalPrice: null,
        profitMargin: null,
        indirectCostMargin: null,
        completionPercentage: 50,
      };
    case 75:
      return {
        ...versionQuotation,
        status: VersionQuotationStatus.DRAFT,
        finalPrice: null,
        // profitMargin: undefined,
        completionPercentage: 75,
      };
    case 100:
      return {
        ...versionQuotation,
        completionPercentage: 100,
      };
    default:
      return versionQuotation;
  }
};
