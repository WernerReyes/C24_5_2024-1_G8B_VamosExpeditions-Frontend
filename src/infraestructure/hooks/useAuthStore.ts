import { useDispatch, useSelector } from "react-redux";
import { onChecking, type AppState, onLogin, onLogout } from "../store";
import { authService } from "../services/auth";
import { toasterAdapter } from "@/presentation/components";
import { constantStorage } from "@/core/constants";

const { USER_AUTH } = constantStorage;

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);

  const startLogin = async (email: string, password: string) => {
    dispatch(onChecking());
    try {
      const { data, message } = await authService.login({ email, password });
      console.log({ data, message });
      dispatch(onLogin(data.user));
      localStorage.setItem(USER_AUTH, JSON.stringify(data.user));
      toasterAdapter.success(message);
    } catch (error: any) {
      throw error;
    }
  };

  const startUserAuthenticated = async () => {
    dispatch(onChecking());

    const userAuth = localStorage.getItem(USER_AUTH);
    // if (userAuth) return;
    try {
      const { data } = await authService.userAuthenticated();
      dispatch(onLogin(data.user));
    } catch (error: any) {
      throw error;
    }
  };


  const startLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem(USER_AUTH);
      dispatch(onLogout());
    } catch (error: any) {
      throw error;
    }
  };

  return {
    //* Atributtes
    ...auth,

    //* Functions
    startLogin,
    startUserAuthenticated,
    startLogout,
    // logout,
  };
};
