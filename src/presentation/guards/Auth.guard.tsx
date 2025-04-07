import type { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import { setMessages } from "@/infraestructure/store";
import { useListUserNotificationsQuery } from "@/infraestructure/store/services/socket/socket.service";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const {
  public: { LOGIN },
} = constantRoutes;

type Props = {
  privateValidation: boolean;
};

export const AuthGuard = ({ privateValidation }: Props) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state: AppState) => state.auth);

  const { data: messageData } = useListUserNotificationsQuery(undefined, {
    skip: !authUser?.id,
  });

  useEffect(() => {
    if (messageData && messageData?.length > 0) {
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
