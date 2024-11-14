import { useDispatch, useSelector } from "react-redux";
import { onChecking, type AppState, onLogin, onLogout } from "../store";
import { authService } from "../services";
import { toasterAdapter } from "@/core/adapters";

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);

  const startLogin = async (email: string, password: string) => {
    dispatch(onChecking());
    try {
      const { data } = await authService.login({ email, password });
      const user = data.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        dispatch(onLogin(user));
        toasterAdapter.success("Bienvenido");
      } else {
        dispatch(onLogout());
        toasterAdapter.error("Credenciales incorrectas");
        throw new Error("Credenciales incorrectas");
      }

      return user;
    } catch (error: any) {
      if(error.code === 'ERR_NETWORK') {
        toasterAdapter.error("Error de conexión");
      }
      throw error;
      //   dispatch(authSlice.actions.loginError(error));
    }
  };

  //   const logout = async () => {
  //     try {
  //       dispatch(authSlice.actions.logout());
  //       await authApi.logout();
  //     } catch (error) {
  //       dispatch(authSlice.actions.logoutError(error));
  //     }
  //   };
  return {
    //* Atributtes
    ...auth,

    //* Functions
    startLogin,
    // logout,
  };
};
