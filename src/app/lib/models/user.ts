export class User {
  id: number;
  firstName: string;
  email: string;
  sessionToken: string;
  leagues: League[];
}

class League {
  id: number;
  userTeamId: number;
  isDefault: boolean;
}
