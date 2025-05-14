import type { AppState } from "@/app/store";
import { extractParams } from "@/core/utils";
import type { GetVersionQuotationsDto } from "@/domain/dtos/versionQuotation";
import type { VersionQuotationEntity } from "@/domain/entities";

export const extractedParams = function (getState: () => AppState) {
  //* Update the data in the cache for the query "getVersionQuotationById"
  const cachedQueries = getState().versionQuotationService
    .subscriptions;
  const extractedParams = extractParams<
    {
      getAllOfficialVersionQuotations: GetVersionQuotationsDto;
      getAllUnofficialVersionQuotations: GetVersionQuotationsDto;
      getAllTrashVersionQuotations: GetVersionQuotationsDto;
      getVersionQuotationById: VersionQuotationEntity["id"];
    }[]
  >(cachedQueries);

  return extractedParams;
};
