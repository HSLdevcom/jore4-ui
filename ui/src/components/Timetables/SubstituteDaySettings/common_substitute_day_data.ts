type CommonSubstituteDay = {
  name: string;
  month: number;
  day: number;
};

export const commonSubstituteDayData: ReadonlyArray<CommonSubstituteDay> = [
  { name: 'Uudenvuodenpäivä', month: 1, day: 1 },
  { name: 'Loppiainen', month: 1, day: 6 },
  { name: 'Vappu', month: 5, day: 1 },
  { name: 'Itsenäisyyspäivän aatto', month: 12, day: 5 },
  { name: 'Itsenäisyyspäivä', month: 12, day: 6 },
  { name: 'Jouluaatto', month: 12, day: 24 },
  { name: 'Joulupäivä', month: 12, day: 25 },
  { name: 'Tapaninpäivä', month: 12, day: 26 },
  { name: 'Uusivuosi', month: 12, day: 31 },
];
