import type { LoginRequest } from "@/domain/dtos/requests/auth";
import { httpRequest } from "@/config";
import { UserEntity } from "@/domain/entities";

const PREFIX = "/users";

export const authService = {
  login: async(loginRequest: LoginRequest) => {
    try {
      return await httpRequest.get<UserEntity[]>(`${PREFIX}`);
    } catch (error) {
      throw error;
    }
  },
};
