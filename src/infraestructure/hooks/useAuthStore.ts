import { useDispatch, useSelector } from "react-redux";
import { onLogin, onLogout } from "../store";
import type { AppState } from "@/app/store";
import {
  useLazyLogoutQuery,
  useLazyUserAuthenticatedQuery,
  useLoginMutation,
} from "../store/services";
import { LoginDto } from "@/domain/dtos/auth";
import { useAlert } from "@/presentation/hooks";
import { useCookieExpirationStore } from "./useCookieExpirationStore";

const MAX_TOASTS = 3;

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state: AppState) => state.auth);

  const { startShowApiError, startShowSuccess } = useAlert(MAX_TOASTS);

  const { init } = useCookieExpirationStore();

  const [login, { isLoading: isLoggingIn, ...restLogin }] = useLoginMutation();

  const [
    userAuthenticated,
    { isLoading: isUserAuthenticatedLoading, ...restUserAuthenticated },
  ] = useLazyUserAuthenticatedQuery();
  const [logout] = useLazyLogoutQuery();

  const startLogin = async (loginDto: LoginDto) => {
    await login(loginDto)
      .unwrap()
      .then(({ data: { user, expiresAt }, message }) => {
        dispatch(onLogin(user));
        startShowSuccess(message);
        init(expiresAt);
      })
      .catch((error) => {
        console.log(error);
        startShowApiError(error);
        // startLogout();
      });
  };

  const startVerifyUserAuthenticated = async () => {
    await userAuthenticated()
      .unwrap()
      .then(({ data: { user, expiresAt } }) => {
        dispatch(onLogin(user));
        init(expiresAt);
      })
      .catch(() => {
        // startLogout();
      });
  };

  const startLogout = async () => {
    await logout().unwrap();
    dispatch(onLogout());
  };

  return {
    //* Atributtes
    authUser,
    loginResult: {
      isLoggingIn,
      ...restLogin,
    },
    userAuthenticatedResult: {
      isUserAuthenticatedLoading,
      ...restUserAuthenticated,
    },

    //* Functions
    startLogin,
    startLogout,
    startVerifyUserAuthenticated,
    // logout,
  };
};
