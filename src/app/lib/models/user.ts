export class User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  sessionToken: string;
  leagues: League[];
}

export class UserResult {
  user?: User;
  error?: string;
  success: boolean;
}

class League {
  id: number;
  userTeamId: number;
  isDefault: boolean;
}
