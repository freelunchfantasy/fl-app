export class LoginPayload {
  e?: string;
  p?: string;
  sessionToken?: string;
}

export class RegisterPayload {
  e: string;
  p: string;
  firstName?: string;
  lastName?: string;
}
