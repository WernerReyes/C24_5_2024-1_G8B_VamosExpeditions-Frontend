import type { AppDispatch, AppState } from "@/app/store";
import type { UserEntity } from "@/domain/entities";
import { versionQuotationService } from "../../versionQuotation.service";
import { extractedParams } from "../extractedParams";

export const updateByUser = function (
  data: UserEntity,
  dispatch: AppDispatch,
  getState: () => AppState
) {
  //* Update the data in the cache for the query "getVersionQuotationById"
  const params = extractedParams(getState);

  for (const param of params) {
    const {
      getVersionQuotationById,
      getAllOfficialVersionQuotations,
      getAllUnofficialVersionQuotations,
    } = param;

    if (getVersionQuotationById) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getVersionQuotationById",
          getVersionQuotationById,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                ...(draft.data.user?.id === data.id ? { user: data } : {}),
              },
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
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: draft.data.content.map((item) => {
                  if (item?.user?.id === data.id) {
                    return {
                      ...item,
                      user: data,
                    };
                  }
                  return item;
                }),
              },
            });
          }
        )
      );
    }

    if (getAllUnofficialVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllUnofficialVersionQuotations",
          getAllUnofficialVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: draft.data.content.map((item) => {
                  if (item?.user?.id === data.id) {
                    return {
                      ...item,
                      user: data,
                    };
                  }
                  return item;
                }),
              },
            });
          }
        )
      );
    }


  }
};

export const updateByUserId = function (
  id: UserEntity["id"],
  online: boolean,
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);
  for (const param of params) {
    const {
      getAllOfficialVersionQuotations,
      getAllUnofficialVersionQuotations,
      getAllTrashVersionQuotations,
    } = param;

    if (getAllOfficialVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllOfficialVersionQuotations",
          getAllOfficialVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: draft.data.content.map((item) => {
                  if (item?.user?.id === id) {
                    return {
                      ...item,
                      user: {
                        ...item.user,
                        online,
                      },
                    };
                  }
                  return item;
                }),
              },
            });
          }
        )
      );
    }

    if (getAllUnofficialVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllUnofficialVersionQuotations",
          getAllUnofficialVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: draft.data.content.map((item) => {
                  if (item?.user?.id === id) {
                    return {
                      ...item,
                      user: {
                        ...item.user,
                        online,
                      },
                    };
                  }
                  return item;
                }),
              },
            });
          }
        )
      );
    }

    if (getAllTrashVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllTrashVersionQuotations",
          getAllTrashVersionQuotations,
          (draft) => {
            console.log("draft", id, online, draft);
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: draft.data.content.map((item) => {
                  if (item?.user?.id === id) {
                    return {
                      ...item,
                      user: {
                        ...item.user,
                        online,
                      },
                    };
                  }
                  return item;
                }),
              },
            });
          }
        )
      );
    }
  }
};
