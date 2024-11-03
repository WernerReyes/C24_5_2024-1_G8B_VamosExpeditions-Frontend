import { AuthRequest } from "./auth.request";

export class LoginRequest extends AuthRequest {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super(email, password);
  } 
}
