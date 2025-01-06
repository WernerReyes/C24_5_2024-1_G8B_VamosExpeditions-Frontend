import { useDispatch, useSelector } from "react-redux";
import { onLogin, onLogout } from "../store";
import { UserEntity } from "@/domain/entities";
import type { AppState } from "@/app/store";


export const useAuthStore = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);

  const startLogin = async (userEntity: UserEntity) => {
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
