export class GameUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export class AuthUser {
  user_id: string;
  expires_in: number;
  email: string;
}

export class GetGameUserDataPayload {
  authUserId: string;
  email: string;
}
