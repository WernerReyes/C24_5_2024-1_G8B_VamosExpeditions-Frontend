import type { AppDispatch, AppState } from "@/app/store";
import type { VersionQuotationEntity } from "@/domain/entities";
import { versionQuotationService } from "../versionQuotation.service";
import { extractedParams } from "./extractedParams";
import type {
  CancelAndReplaceApprovedOfficialVersionQuotation,
  UnArchiveVersionQuotation,
  UpdateOfficialVersionQuotation,
} from "../versionQuotation.response";

export const update = function (
  data: VersionQuotationEntity,
  dispatch: AppDispatch,
  getState: () => AppState
) {
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
                ...data,
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
                  if (
                    item.id.quotationId === data.id.quotationId &&
                    item.id.versionNumber === data.id.versionNumber
                  ) {
                    return {
                      ...data,
                      hasVersions: item.hasVersions,
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
                  if (
                    item.id.quotationId === data.id.quotationId &&
                    item.id.versionNumber === data.id.versionNumber
                  ) {
                    return data;
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

export const updateOfficial = function (
  data: UpdateOfficialVersionQuotation,
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);

  for (const param of params) {
    const {
      getAllOfficialVersionQuotations,
      getAllUnofficialVersionQuotations,
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
                  if (
                    item.id.quotationId === data.unOfficial.id.quotationId &&
                    item.id.versionNumber === data.unOfficial.id.versionNumber
                  ) {
                    return {
                      ...data.newOfficial,
                      hasVersions: item.hasVersions,
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
                  if (
                    item.id.quotationId === data.newOfficial.id.quotationId &&
                    item.id.versionNumber === data.newOfficial.id.versionNumber
                  ) {
                    return data.unOfficial;
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

export const cancelAndReplaceApprovedOfficial = function (
  data: CancelAndReplaceApprovedOfficialVersionQuotation,
  dispatch: AppDispatch,
  getState: () => AppState
) {
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
                ...data.newApproved,
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
                  if (
                    item.id.quotationId === data.oldApproved.id.quotationId &&
                    item.id.versionNumber === data.oldApproved.id.versionNumber
                  ) {
                    return {
                      ...data.newApproved,
                      hasVersions: item.hasVersions,
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
                  if (
                    item.id.quotationId === data.newApproved.id.quotationId &&
                    item.id.versionNumber === data.newApproved.id.versionNumber
                  ) {
                    return data.oldApproved;
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

export const duplicateMultiple = function (
  data: VersionQuotationEntity[],
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);

  for (const item of data) {
    for (const {
      getAllOfficialVersionQuotations,
      getAllUnofficialVersionQuotations,
    } of params) {
      if (getAllOfficialVersionQuotations) {
        dispatch(
          versionQuotationService.util.updateQueryData(
            "getAllOfficialVersionQuotations",
            getAllOfficialVersionQuotations,
            (draft) => {
              const duplicated = draft.data.content.find(
                (i) =>
                  i.id.quotationId === item.id.quotationId && !i.hasVersions
              );
              if (duplicated) {
                Object.assign(draft, {
                  data: {
                    ...draft.data,
                    content: draft.data.content.map((item) => {
                      if (
                        item.id.quotationId === duplicated.id.quotationId &&
                        item.id.versionNumber === duplicated.id.versionNumber
                      ) {
                        return {
                          ...item,
                          hasVersions: true,
                        };
                      }
                      return item;
                    }),
                  },
                });
              }
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
                  content: [
                    { ...item, hasVersions: false },
                    ...(draft.data.content.length + 1 > draft.data.limit
                      ? draft.data.content.filter((content) => {
                          return (
                            content.id.versionNumber !==
                            Math.min(
                              ...draft.data.content.map(
                                (c) => c.id.versionNumber
                              )
                            )
                          );
                        })
                      : draft.data.content),
                  ],
                  total: draft.data.total + 1,
                },
              });
            }
          )
        );
      }
    }
  }
};

export const archive = function (
  data: VersionQuotationEntity,
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);

  for (const param of params) {
    const {
      getAllOfficialVersionQuotations,
      getAllUnofficialVersionQuotations,
      getAllArchivedVersionQuotations,
    } = param;

    if (getAllUnofficialVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllUnofficialVersionQuotations",
          getAllUnofficialVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: draft.data.content.filter(
                  (item) =>
                    !(
                      item.id.quotationId === data.id.quotationId &&
                      item.id.versionNumber === data.id.versionNumber
                    )
                ),
                total: draft.data.total - 1,
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
                content: draft.data.content.filter(
                  (item) =>
                    !(
                      item.id.quotationId === data.id.quotationId &&
                      item.id.versionNumber === data.id.versionNumber
                    )
                ),
                total: draft.data.total - 1,
              },
            });
          }
        )
      );
    }

    if (getAllArchivedVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllArchivedVersionQuotations",
          getAllArchivedVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: [data, ...draft.data.content],
                total: draft.data.total + 1,
              },
            });
          }
        )
      );
    }
  }
};

export const unArchive = function (
  {
    unArchivedVersionQuotation: data,
    newUnOfficial,
  }: UnArchiveVersionQuotation,
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);

  for (const param of params) {
    const {
      getAllOfficialVersionQuotations,
      getAllArchivedVersionQuotations,
      getAllUnofficialVersionQuotations,
    } = param;

    if (getAllOfficialVersionQuotations && data.official) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllOfficialVersionQuotations",
          getAllOfficialVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: [data, ...draft.data.content],
                total: draft.data.total + 1,
              },
            });
          }
        )
      );
    }

    if (getAllUnofficialVersionQuotations && !data.official) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllUnofficialVersionQuotations",
          getAllUnofficialVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: [data, ...draft.data.content],
                total: draft.data.total + 1,
              },
            });
          }
        )
      );
    }

    if (getAllArchivedVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllArchivedVersionQuotations",
          getAllArchivedVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: draft.data.content
                  .filter(
                    (item) =>
                      !(
                        item.id.quotationId === data.id.quotationId &&
                        item.id.versionNumber === data.id.versionNumber
                      )
                  )
                  .map((item) => {
                    if (
                      item.id.quotationId === newUnOfficial?.quotationId &&
                      item.id.versionNumber === newUnOfficial?.versionNumber
                    ) {
                      return {
                        ...item,
                        official: false,
                      };
                    }
                    return item;
                  }),
                total: draft.data.total - 1,
              },
            });
          }
        )
      );
    }
  }
};
