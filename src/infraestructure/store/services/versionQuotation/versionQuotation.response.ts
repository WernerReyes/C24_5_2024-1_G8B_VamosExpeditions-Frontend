import type { VersionQuotationEntity } from "@/domain/entities";

export interface QuotationWithVersions extends VersionQuotationEntity {}


export interface TotalDraftsVersionQuotation {
  totalDrafts: number;
  totalDraftsPreviousMonth: number;
  increase: number;
}
export interface UpdateOfficialVersionQuotation {
  newOfficial: VersionQuotationEntity;
  unOfficial: VersionQuotationEntity;
}

export interface CancelAndReplaceApprovedOfficialVersionQuotation {
  newApproved: VersionQuotationEntity;
  oldApproved: VersionQuotationEntity;
}

