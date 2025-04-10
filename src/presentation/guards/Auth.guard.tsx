import { Navigate, Outlet } from "react-router-dom";
import { constantRoutes } from "@/core/constants";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import {
  useConnectSocketQuery,
  useGetAllUsersQuery,
  useListUserNotificationsQuery,
} from "@/infraestructure/store/services/socket/socket.service";
import { useEffect } from "react";
import { setMessages, setUsers } from "@/infraestructure/store";

const {
  public: { LOGIN },
} = constantRoutes;

type Props = {
  privateValidation: boolean;
};

export const AuthGuard = ({ privateValidation }: Props) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state: AppState) => state.auth);

  useConnectSocketQuery(undefined, { skip: !authUser?.id });

  const { data: userAll } = useGetAllUsersQuery(undefined, {
    skip: !authUser?.id,
  });

  useEffect(() => {
    if (userAll && userAll?.length > 0) {
      dispatch(setUsers(userAll));
    }
  }, [userAll, dispatch]);

 
  const { data: messageData } = useListUserNotificationsQuery(undefined, { skip: !authUser?.id })
  

  useEffect(() => {
    if (messageData  && messageData?.length > 0) {
      dispatch(setMessages(messageData));
    }
  }, [messageData, dispatch]);
  

  return authUser?.id ? (
    privateValidation ? (
      <Outlet />
    ) : (
      <Navigate replace to={"/"} />
    )
  ) : (
    <Navigate replace to={LOGIN} />
  );
};
