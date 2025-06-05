import type { UserEntity } from "@/domain/entities";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "@reduxjs/toolkit/query";
import { userService } from "./user.service";
import { AppState } from "@/app/store";
import { extractParams } from "@/core/utils";
import { GetUsersDto } from "@/domain/dtos/user";

type Service = typeof userService.reducerPath;
export const userCache = {
  upsertUser: function (
    data: UserEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, Service>
  ) {
    const args = userService.util.selectCachedArgsForQuery(
      getState(),
      "getUsers"
    );
    

    args.forEach((arg) => {
      dispatch(
        userService.util.updateQueryData("getUsers", arg, (draft) => {
          const existUser = draft.data.content.findIndex(
            (user) => user.id === data.id
          );
          if (existUser !== -1) {
            draft.data.content = draft.data.content.map((user) => {
              return user.id === data.id
                ? {
                    ...user,
                    ...data,
                  }
                : user
            }
            );
          } else {
            draft.data.content =
              draft.data.limit < draft.data.total + 1
                ? draft.data.content.slice(-draft.data.limit)
                : draft.data.content;

            draft.data.content = [data, ...draft.data.content];
            draft.data = { ...draft.data, total: draft.data.total + 1 };
          }
        })
      );
    });
  },

  trash: function (
    data: UserEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) {
    const cachedQueries = getState().userService.queries;

    const extractedParams = extractParams<
      {
        getUsers: GetUsersDto;
        getTrashUsers: GetUsersDto;
      }[]
    >(cachedQueries);

    for (const query of extractedParams) {
      if (query.getUsers) {
        dispatch(
          userService.util.updateQueryData(
            "getUsers",
            query.getUsers,
            (draft) => {
              draft.data = {
                ...draft.data,
                content: draft.data.content.filter(
                  (user) => user.id !== data.id
                ),
                total: draft.data.total - 1,
              };
            }
          )
        );
      }

      if (query.getTrashUsers) {
        dispatch(
          userService.util.updateQueryData(
            "getTrashUsers",
            query.getTrashUsers,
            (draft) => {
              draft.data = {
                ...draft.data,
                content: [data, ...draft.data.content],
                total: draft.data.total + 1,
              };
            }
          )
        );
      }
    }
  },

  restore: function (
    data: UserEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) {
    const cachedQueries = getState().userService.queries;

    const extractedParams = extractParams<
      {
        getUsers: GetUsersDto;
        getTrashUsers: GetUsersDto;
      }[]
    >(cachedQueries);

    for (const query of extractedParams) {
      if (query.getUsers) {
        dispatch(
          userService.util.updateQueryData(
            "getUsers",
            query.getUsers,
            (draft) => {
              draft.data = {
                ...draft.data,
                content: [data, ...draft.data.content],
                total: draft.data.total + 1,
              };
            }
          )
        );
      }

      if (query.getTrashUsers) {
        dispatch(
          userService.util.updateQueryData(
            "getTrashUsers",
            query.getTrashUsers,
            (draft) => {
              draft.data = {
                ...draft.data,
                content: draft.data.content.filter(
                  (user) => user.id !== data.id
                ),
                total: draft.data.total - 1,
              };
            }
          )
        );
      }
    }
  },
};
