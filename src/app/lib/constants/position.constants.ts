export const Position = {
  Quarterback: { display: 'QB', code: 'QB' },
  RunningBack: { display: 'RB', code: 'RB' },
  RunningBackWideReceiver: { display: 'RB/WR', code: 'RB/WR' },
  WideReceiver: { display: 'WR', code: 'WR' },
  WideReceiverTightEnd: { display: 'WR/TE', code: 'WR/TE' },
  TightEnd: { display: 'TE', code: 'TE' },
  Flex: { display: 'FLEX', code: 'RB/WR/TE' },
  Superflex: { display: 'OP', code: 'OP' },
  Defense: { display: 'D/ST', code: 'D/ST' },
  Kicker: { display: 'K', code: 'K' },
};

export const DEFAULT_STARTING_POSITIONS: string[] = [
  Position.Quarterback.code,
  Position.RunningBack.code,
  Position.RunningBack.code,
  Position.WideReceiver.code,
  Position.WideReceiver.code,
  Position.Flex.code,
  Position.Defense.code,
  Position.Kicker.code,
];
