import type { VersionQuotationEntity } from "@/domain/entities";

export interface UpdateOfficialVersionQuotation {
  newOfficial: VersionQuotationEntity;
  unOfficial: VersionQuotationEntity;
}

export interface CancelAndReplaceApprovedOfficialVersionQuotation {
  newApproved: VersionQuotationEntity;
  oldApproved: VersionQuotationEntity;
}

export interface RestoreVersionQuotation {
  newUnOfficial?: VersionQuotationEntity["id"];
  restoreVersionQuotation: VersionQuotationEntity;
}
