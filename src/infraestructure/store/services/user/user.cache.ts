import type { UserEntity } from "@/domain/entities";
import { userService } from "./user.service";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "@reduxjs/toolkit/query";

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
                    const existUser = draft.data.findIndex(
                        (user) => user.id === data.id
                    );
                    if (existUser !== -1) {
                        draft.data = draft.data.map((user) =>
                            user.id === data.id ? data : user
                        );
                    } else {
                        draft.data.push(data);
                    }
                })
            );
        });
    }
}
