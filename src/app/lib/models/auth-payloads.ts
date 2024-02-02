export class LoginPayload {
  e?: string;
  p?: string;
  sessionToken?: string;
}

export class RegisterPayload {
  e: string;
  p: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export class ContactPayload {
  e?: string;
  firstName?: string;
  lastName?: string;
  message: string;
}
