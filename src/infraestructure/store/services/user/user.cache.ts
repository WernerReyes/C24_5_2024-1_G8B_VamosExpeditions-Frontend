import type { UserEntity } from "@/domain/entities";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "@reduxjs/toolkit/query";
import { userService } from "./user.service";

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
            draft.data.content.push(data);
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

          // dispatch(setUsers(sortedUsers));
        })
      );
    });
  },

  // TODO: When I delete a user, I need to remove it from the cache and add it to the trash
  toogleTrash: function (
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
          console.log("draft", data);
          if (data.isDeleted) {
            draft.data.content = draft.data.content.filter(
              (user) => user.id !== data.id
            );
            return;
          }
          const updated = draft.data.content.map((user) =>
            user.id === data.id ? { ...user, ...data } : user
          );
          draft.data.content = updated;
        })
      );
    });
  },
};
