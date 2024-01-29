import { Team } from '@app/lib/models/league';
import { RosterService } from './roster-service';
import { Injectable } from '@angular/core';

@Injectable()
export class SimulationPayloadService {
  constructor(private rosterService: RosterService) {}

  constructSimulationPayload(leagueId: number, teams: Team[], schedule: number[][][]) {
    return {
      id: leagueId,
      teams: teams.map(t => ({
        id: t.id,
        // BREAK ROSTER BETWEEN STARTERS AND BENCH? starters: this.rosterService.constructStarters(),
        roster: t.roster.map(p => ({
          id: p.id,
          name: p.name,
          scoreProjections: [p.projectedAveragePoints],
        })),
      })),
      schedule,
    };
  }
}
