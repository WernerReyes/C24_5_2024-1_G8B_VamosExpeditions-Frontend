import type { VersionQuotationEntity } from "@/domain/entities";

export interface QuotationWithVersions extends VersionQuotationEntity {}

export interface QuotationHasUnofficialVersions extends VersionQuotationEntity {
  hasUnofficialVersions: boolean;
}

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

export interface DeleteMultipleVersionQuotations {
  versionQuotationsDeleted: VersionQuotationEntity[];
  versionQuotationsUpdated: VersionQuotationEntity[];
}
