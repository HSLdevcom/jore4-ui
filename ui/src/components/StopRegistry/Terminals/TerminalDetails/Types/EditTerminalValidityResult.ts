export type EditTerminalValidityResult = {
  readonly privateCode: string;
  readonly validityStart: Temporal.PlainDate;
  readonly validityEnd: Temporal.PlainDate | undefined;
  readonly indefinite: boolean;
};
