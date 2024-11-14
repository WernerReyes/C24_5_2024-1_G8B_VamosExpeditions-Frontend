import type { LoginRequest } from "@/domain/dtos/requests/auth";
import { httpRequest } from "@/config";
import type { UserEntity } from "@/domain/entities";

const PREFIX = "/users";

export const authService = {
  login: async(loginRequest: LoginRequest) => {
    try {
      console.log(loginRequest);
      return await httpRequest.get<UserEntity[]>(`${PREFIX}`);
    } catch (error) {
      throw error;
    }
  },
};
