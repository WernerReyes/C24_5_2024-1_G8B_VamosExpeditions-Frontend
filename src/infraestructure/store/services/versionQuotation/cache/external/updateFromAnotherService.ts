import type { AppDispatch, AppState } from "@/app/store";
import type { VersionQuotationEntity } from "@/domain/entities";
import { versionQuotationService } from "../../versionQuotation.service";
import { extractedParams } from "../extractedParams";

export const updateFromAnotherService = function (
  { reservation, ...versionQuotation }: VersionQuotationEntity,
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);

  for (const param of params) {
    const { getAllOfficialVersionQuotations, getVersionQuotationById } = param;

    if (getVersionQuotationById) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getVersionQuotationById",
          getVersionQuotationById,
          (draft) => {
            Object.assign(draft, {
              data: versionQuotation,
            });
          }
        )
      );
    }

    if (getAllOfficialVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllOfficialVersionQuotations",
          getAllOfficialVersionQuotations,
          (draft) => {
            const updated = draft.data.content.find(
              (item) =>
                item.id.quotationId === versionQuotation.id.quotationId &&
                item.id.versionNumber === versionQuotation.id.versionNumber
            );
            Object.assign(draft, {
              data: {
                ...draft.data,
                ...draft.data.content,
                content: updated
                  ? draft.data.content.map((item) => {
                      if (
                        item.id.quotationId ===
                          versionQuotation.id.quotationId &&
                        item.id.versionNumber ===
                          versionQuotation.id.versionNumber
                      ) {
                        return {
                          ...versionQuotation,
                          reservation,
                          hasVersions: item.hasVersions,
                        };
                      }
                      return item;
                    })
                  : draft.data.content.length < draft.data.limit
                  ? [versionQuotation, ...draft.data.content].slice(
                      0,
                      draft.data.limit
                    )
                  : [versionQuotation, ...draft.data.content],
                total: updated ? draft.data.total : draft.data.total + 1,
              },
            });
          }
        )
      );
    }
  }
};
