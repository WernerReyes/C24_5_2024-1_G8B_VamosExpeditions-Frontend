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
            draft.data.content = draft.data.content.map((user) =>
              user.id === data.id ? data : user
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

  updateById: function (
    id: UserEntity["id"],
    online: boolean,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, Service>,
    devices: string[] = []
  ) {
    const args = userService.util.selectCachedArgsForQuery(
      getState(),
      "getUsers"
    );

    args.forEach((arg) => {
      dispatch(
        userService.util.updateQueryData("getUsers", arg, (draft) => {
          const updated = draft.data.content.map((user) =>
            user.id === id
              ? {
                  ...user,
                  online,
                  activeDevices: user.activeDevices?.map((device) =>
                    devices.includes(device.deviceId)
                      ? { ...device, isOnline: online }
                      : device
                  ),
                }
              : user
          );

          draft.data.content = updated;
        })
      );
    });
  },

  updateByDeviceId: function (
    devices: string[],
    userId: UserEntity["id"],
    online: boolean,
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
          console.log({
            hola: draft.data.content.map((user) => {
              if (user.id === userId) {
                return {
                  ...user,
                  activeDevices: user.activeDevices?.map((device) =>
                    devices.includes(device.deviceId)
                      ? { ...device, isOnline: online }
                      : device
                  ),
                };
              }

              return user;
            }),
          });
          const updated = draft.data.content.map((user) => {
            if (user.id === userId) {
              return {
                ...user,
                activeDevices: user.activeDevices?.map((device) =>
                  devices.includes(device.deviceId)
                    ? { ...device, isOnline: online }
                    : device
                ),
              };
            }

            return user;
          });

          draft.data.content = updated;
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
