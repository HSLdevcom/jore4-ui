export type EditStopVersionResult = {
  readonly stopPlaceId: string;
  readonly quayId: string;
  readonly priority: number;
  readonly validityStart: Temporal.PlainDate;
  readonly validityEnd: Temporal.PlainDate | undefined;
  readonly indefinite: boolean;
};
