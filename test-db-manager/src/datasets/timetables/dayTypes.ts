// NOTE: These magical day type id's are populated in hasura.
// Maybe rather populate day type here and refer to it.
// Monday-Thursday
export const MON_THUR_DAY_TYPE = '6781bd06-08cf-489e-a2bb-be9a07b15752';
// Monday-Friday
export const MON_FRI_DAY_TYPE = '38853b0d-ec36-4110-b4bc-f53218c6cdcd';
// Monday
export const MON_DAY_TYPE = 'd3dfb71f-8ee1-41fd-ad49-c4968c043290';
// Tuesday
export const TUE_DAY_TYPE = 'c1d27421-dd3b-43b6-a0b9-7387aae488c9';
// Wednesday
export const WED_DAY_TYPE = '5ec086a3-343c-42f0-a050-3464fc3d63de';
// Thursday
export const THUR_DAY_TYPE = '9c708e58-fb49-440e-b4bd-736b9275f53f';
// Friday
export const FRI_DAY_TYPE = '7176e238-d46e-4583-a567-b836b1ae2589';
// Saturday
export const SAT_DAY_TYPE = '61374d2b-5cce-4a7d-b63a-d487f3a05e0d';
// Sunday
export const SUN_DAY_TYPE = '0e1855f1-dfca-4900-a118-f608aa07e939';

export const dayTypeIds = [
  MON_THUR_DAY_TYPE,
  MON_FRI_DAY_TYPE,
  MON_DAY_TYPE,
  TUE_DAY_TYPE,
  WED_DAY_TYPE,
  THUR_DAY_TYPE,
  FRI_DAY_TYPE,
  SAT_DAY_TYPE,
  SUN_DAY_TYPE,
] as const;
export type DayTypeId = (typeof dayTypeIds)[number];
