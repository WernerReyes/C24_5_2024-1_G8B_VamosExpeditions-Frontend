import { useDispatch, useSelector } from "react-redux";
import { onChecking, type AppState, onLogin, onLogout } from "../store";
import { authService } from "../services/auth";
import { toasterAdapter } from "@/presentation/components";
import { constantStorage } from "@/core/constants";
import { UserEntity } from "@/domain/entities";

const { USER_AUTH } = constantStorage;

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);

  // const startLogin = async (email: string, password: string) => {
  //   dispatch(onChecking());
  //   try {
  //     const { data, message } = await authService.login({ email, password });
  //     console.log({ data, message });
  //     dispatch(onLogin(data.user));
  //     localStorage.setItem(USER_AUTH, JSON.stringify(data.user));
  //     toasterAdapter.success(message);
  //   } catch (error: any) {
  //     throw error;
  //   }
  // };

  const startLogin = async (userEntity: UserEntity) => {
    dispatch(onChecking());

    dispatch(onLogin(userEntity));
  };

  const startLogout = async () => {
    dispatch(onLogout());
  };

  return {
    //* Atributtes
    ...auth,

    //* Functions
    startLogin,
    startLogout,
    // logout,
  };
};
