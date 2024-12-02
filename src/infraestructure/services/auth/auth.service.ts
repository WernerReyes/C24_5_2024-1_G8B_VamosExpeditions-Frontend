import type { LoginDto } from "@/domain/dtos/auth";
import { httpRequest } from "@/config";
import type { LoginResponse } from "./auth.response";

const PREFIX = "/auth";

export const authService = {
  login: async (loginDto: LoginDto) => {
    try {
      return await httpRequest.post<LoginResponse>(`${PREFIX}/login`, loginDto);
    } catch (error) {
      throw error;
    }
  },

  userAuthenticated: async () => {
    try {
      return await httpRequest.get<LoginResponse>(
        `${PREFIX}/user-authenticated`
      );
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      return await httpRequest.post<null>(`${PREFIX}/logout`);
    } catch (error) {
      throw error;
    }
  },

};
