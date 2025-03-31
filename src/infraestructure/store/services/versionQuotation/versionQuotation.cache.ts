import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "@reduxjs/toolkit/query";
import { versionQuotationService } from "./versionQuotation.service";
import type {
  CancelAndReplaceApprovedOfficialVersionQuotation,
  DeleteMultipleVersionQuotations,
  UpdateOfficialVersionQuotation,
} from "./versionQuotation.response";
import type {
  ClientEntity,
  HotelRoomTripDetailsEntity,
  TripDetailsEntity,
  UserEntity,
  VersionQuotationEntity,
} from "@/domain/entities";
import type { AppState } from "@/app/store";
import { extractParams } from "@/core/utils";
import { GetVersionQuotationsDto } from "@/domain/dtos/versionQuotation";
import {
  addMultipleHotelRoomTripDetails,
  updateVersionQuotationByClient,
  updateVersionQuotationByTripDetails,
  updateVersionQuotationByUser,
  updateVersionQuotationFromAnotherService,
  updateManyHotelRoomTripDetailsByDate,
  deleteManyHotelRoomTripDetails
} from "./cache/external";

export const versionQuotationCache = {
  updateVersionQuotationFromAnotherService: (
    data: VersionQuotationEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) => updateVersionQuotationFromAnotherService(data, dispatch, getState),

  updateVersionQuotationByUser: (
    data: UserEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) => updateVersionQuotationByUser(data, dispatch, getState),

  updateVersionQuotationByTripDetails: (
    data: TripDetailsEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) => updateVersionQuotationByTripDetails(data, dispatch, getState),

  updateVersionQuotationByClient: (
    data: ClientEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) => updateVersionQuotationByClient(data, dispatch, getState),

  addMultipleHotelRoomTripDetails: (
    data: HotelRoomTripDetailsEntity[],
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) =>
    addMultipleHotelRoomTripDetails(data, dispatch, getState),

  updateManyHotelRoomTripDetailsByDate: (
    data: HotelRoomTripDetailsEntity[],
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) => updateManyHotelRoomTripDetailsByDate(data, dispatch, getState),

  deleteManyHotelRoomTripDetails: (
    data: HotelRoomTripDetailsEntity[],
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) => deleteManyHotelRoomTripDetails(data, dispatch, getState),

  deleteHotelRoomTripDetails: (
    data: HotelRoomTripDetailsEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) => deleteManyHotelRoomTripDetails([data], dispatch, getState),

  deleteMultipleVersionsFromAnotherService: function (
    data: VersionQuotationEntity[],
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) {
    const cachedQueries = (getState() as AppState).versionQuotationService
      .subscriptions;
    const extractedParams = extractParams<
      {
        getAllOfficialVersionQuotations: GetVersionQuotationsDto;
        getAllUnofficialVersionQuotations: GetVersionQuotationsDto;
        getVersionQuotationById: VersionQuotationEntity["id"];
      }[]
    >(cachedQueries);

    for (const params of extractedParams) {
      const {
        getAllOfficialVersionQuotations,
        getVersionQuotationById,
        getAllUnofficialVersionQuotations,
      } = params;

      if (getVersionQuotationById) {
        dispatch(
          versionQuotationService.util.updateQueryData(
            "getVersionQuotationById",
            getVersionQuotationById,
            (draft) => {
              Object.assign(draft, {
                data: data.find((deleted) => deleted.id === draft.data.id)
                  ? undefined
                  : draft.data,
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
                      !data.find(
                        (deleted) =>
                          deleted.id.quotationId === item.id.quotationId &&
                          deleted.id.versionNumber === item.id.versionNumber
                      )
                  ),
                  total: draft.data.total - data.length,
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
                  content: draft.data.content.filter(
                    (item) =>
                      !data.find(
                        (deleted) =>
                          deleted.id.quotationId === item.id.quotationId &&
                          deleted.id.versionNumber === item.id.versionNumber
                      )
                  ),
                  total: draft.data.total - data.length,
                },
              });
            }
          )
        );
      }
    }
  },

  updateVersionQuotation: function (
    data: VersionQuotationEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, "versionQuotationService">
  ) {
    //* Update the data in the cache for the query "getVersionQuotationById"
    const argsById = versionQuotationService.util.selectCachedArgsForQuery(
      getState(),
      "getVersionQuotationById"
    );

    argsById.forEach((arg) => {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getVersionQuotationById",
          arg,
          (draft) => {
            Object.assign(draft, {
              data,
            });
          }
        )
      );
    });
    if (data.official) {
      //* Update the data in the cache for the query "getAllVersionQuotations"
      const args = versionQuotationService.util.selectCachedArgsForQuery(
        getState(),
        "getAllOfficialVersionQuotations"
      );

      args.forEach((arg) => {
        dispatch(
          versionQuotationService.util.updateQueryData(
            "getAllOfficialVersionQuotations",
            arg,
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
                        hasUnofficialVersions: item.hasUnofficialVersions,
                      };
                    }
                    return item;
                  }),
                },
              });
            }
          )
        );
      });
    } else {
      //* Update the data in the cache for the query "getAllVersionQuotations"
      const args = versionQuotationService.util.selectCachedArgsForQuery(
        getState(),
        "getAllUnofficialVersionQuotations"
      );

      args.forEach((arg) => {
        dispatch(
          versionQuotationService.util.updateQueryData(
            "getAllUnofficialVersionQuotations",
            arg,
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
      });
    }
  },

  updateOfficialVersionQuotation: function (
    official: boolean,
    data: UpdateOfficialVersionQuotation,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, "versionQuotationService">
  ) {
    if (official) {
      const args = versionQuotationService.util.selectCachedArgsForQuery(
        getState(),
        "getAllOfficialVersionQuotations"
      );
      args.forEach((arg) => {
        dispatch(
          versionQuotationService.util.updateQueryData(
            "getAllOfficialVersionQuotations",
            arg,
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
                        hasUnofficialVersions: item.hasUnofficialVersions,
                      };
                    }
                    return item;
                  }),
                },
              });
            }
          )
        );
      });
    } else {
      const args = versionQuotationService.util.selectCachedArgsForQuery(
        getState(),
        "getAllUnofficialVersionQuotations"
      );
      args.forEach((arg) => {
        dispatch(
          versionQuotationService.util.updateQueryData(
            "getAllUnofficialVersionQuotations",
            arg,
            (draft) => {
              Object.assign(draft, {
                data: {
                  ...draft.data,
                  content: draft.data.content.map((item) => {
                    if (
                      item.id.quotationId === data.newOfficial.id.quotationId &&
                      item.id.versionNumber ===
                        data.newOfficial.id.versionNumber
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
      });
    }
  },

  cancelAndReplaceApprovedOfficialVersionQuotation: function (
    data: CancelAndReplaceApprovedOfficialVersionQuotation,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, "versionQuotationService">
  ) {
    //* Update the data in the cache for the query "getVersionQuotationById"
    const argsById = versionQuotationService.util.selectCachedArgsForQuery(
      getState(),
      "getVersionQuotationById"
    );

    argsById.forEach((arg) => {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getVersionQuotationById",
          arg,
          (draft) => {
            Object.assign(draft, {
              data: data.newApproved,
            });
          }
        )
      );
    });

    //* Update the data in the cache for the query "getAllOfficialVersionQuotations"
    const args = versionQuotationService.util.selectCachedArgsForQuery(
      getState(),
      "getAllOfficialVersionQuotations"
    );

    args.forEach((arg) => {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllOfficialVersionQuotations",
          arg,
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
                      hasUnofficialVersions: item.hasUnofficialVersions,
                    };
                  }
                  return item;
                }),
              },
            });
          }
        )
      );
    });

    //* Update the data in the cache for the query "getAllUnofficialVersionQuotations"
    const argsUnofficial =
      versionQuotationService.util.selectCachedArgsForQuery(
        getState(),
        "getAllUnofficialVersionQuotations"
      );

    argsUnofficial.forEach((arg) => {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllUnofficialVersionQuotations",
          arg,
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
    });
  },

  duplicateMultipleVersions: function (
    data: VersionQuotationEntity[],
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, "versionQuotationService">
  ) {
    for (let item of data) {
      //* Update the data in the cache for the query "getAllOfficialVersionQuotations"
      const args = versionQuotationService.util.selectCachedArgsForQuery(
        getState(),
        "getAllOfficialVersionQuotations"
      );
      args.forEach((arg) => {
        dispatch(
          versionQuotationService.util.updateQueryData(
            "getAllOfficialVersionQuotations",
            arg,
            (draft) => {
              const duplicated = draft.data.content.find(
                (i) =>
                  i.id.quotationId === item.id.quotationId &&
                  !i.hasUnofficialVersions
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
                          hasUnofficialVersions: true,
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
      });
      if (!item.official) {
        //* Update the data in the cache for the query "getAllUnofficialVersionQuotations"
        const args = versionQuotationService.util.selectCachedArgsForQuery(
          getState(),
          "getAllUnofficialVersionQuotations"
        );
        args.forEach((arg) => {
          dispatch(
            versionQuotationService.util.updateQueryData(
              "getAllUnofficialVersionQuotations",
              arg,
              (draft) => {
                Object.assign(draft, {
                  data: {
                    ...draft.data,
                    content: [
                      ...draft.data.content,

                      ...(draft.data.content.length < draft.data.limit
                        ? [{ ...item, hasUnofficialVersions: false }]
                        : []),
                    ],
                    total: draft.data.total + 1,
                  },
                });
              }
            )
          );
        });
      }
    }
  },

  deleteMultipleVersions: function (
    data: DeleteMultipleVersionQuotations,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, "versionQuotationService">
  ) {
    //* Update the data in the cache for the query "getVersionQuotationById"
    const argsById = versionQuotationService.util.selectCachedArgsForQuery(
      getState(),
      "getVersionQuotationById"
    );
    argsById.forEach((arg) => {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getVersionQuotationById",
          arg,
          (draft) => {
            if (!draft?.data) return;
            Object.assign(draft, {
              data: data.versionQuotationsDeleted.find(
                (deleted) =>
                  deleted.id.quotationId === draft.data.id?.quotationId &&
                  deleted.id.versionNumber === draft.data.id?.versionNumber
              )
                ? undefined
                : draft.data,
            });
          }
        )
      );
    });

    for (let index = 0; index < data.versionQuotationsDeleted.length; index++) {
      const itemToDelete = data.versionQuotationsDeleted[index];
      const itemToUpdate = data.versionQuotationsUpdated[index];
      //* Delete the data in the cache for the query "getAllOfficialVersionQuotations"
      if (itemToDelete.official) {
        const args = versionQuotationService.util.selectCachedArgsForQuery(
          getState(),
          "getAllOfficialVersionQuotations"
        );
        args.forEach((arg) => {
          dispatch(
            versionQuotationService.util.updateQueryData(
              "getAllOfficialVersionQuotations",
              arg,
              (draft) => {
                Object.assign(draft, {
                  data: {
                    ...draft.data,
                    content: itemToUpdate
                      ? draft.data.content.map((content) => {
                          if (
                            content.id.quotationId ===
                              itemToUpdate.id.quotationId &&
                            content.official
                          ) {
                            return {
                              ...itemToUpdate,
                              hasUnofficialVersions:
                                content.hasUnofficialVersions,
                            };
                          }
                          return content;
                        })
                      : draft.data.content.filter(
                          (content) =>
                            !(
                              content.id.quotationId ===
                                itemToDelete.id.quotationId &&
                              content.id.versionNumber ===
                                itemToDelete.id.versionNumber
                            )
                        ),
                    total: draft.data.total - 1,
                  },
                });
              }
            )
          );
        });
      }
      // else {

      //* Delete the data in the cache for the query "getAllUnofficialVersionQuotations"
      const args = versionQuotationService.util.selectCachedArgsForQuery(
        getState(),
        "getAllUnofficialVersionQuotations"
      );
      args.forEach((arg) => {
        dispatch(
          versionQuotationService.util.updateQueryData(
            "getAllUnofficialVersionQuotations",
            arg,
            (draft) => {
              Object.assign(draft, {
                data: {
                  ...draft.data,
                  content: draft.data.content.filter((content) => {
                    const isItemToUpdate =
                      content.id.quotationId ===
                        itemToUpdate?.id?.quotationId &&
                      content.id.versionNumber ===
                        itemToUpdate?.id?.versionNumber;

                    const isItemToDelete =
                      content.id.quotationId ===
                        itemToDelete?.id?.quotationId &&
                      content.id.versionNumber ===
                        itemToDelete?.id?.versionNumber;

                    return !(isItemToUpdate || isItemToDelete);
                  }),

                  total: draft.data.total - 1,
                },
              });
            }
          )
        );
      });
      // }
    }
  },
};
