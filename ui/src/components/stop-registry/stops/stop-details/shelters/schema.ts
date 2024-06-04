import { z } from 'zod';
import {
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
} from '../../../../../generated/graphql';
import {
  createNullableEnum,
  nullableBoolean,
  nullableNumber,
} from '../../../../forms/common';

const shelterFormRowSchema = z.object({
  shelterType: createNullableEnum<StopRegistryShelterType>(),
  shelterElectricity: createNullableEnum<StopRegistryShelterElectricity>(),
  shelterLighting: nullableBoolean,
  shelterCondition: createNullableEnum<StopRegistryShelterCondition>(),
  timetableCabinets: nullableNumber,
  trashCan: nullableBoolean,
  shelterHasDisplay: nullableBoolean,
  bicycleParking: nullableBoolean,
  leaningRail: nullableBoolean,
  outsideBench: nullableBoolean,
  shelterFasciaBoardTaping: nullableBoolean,
});

export const sheltersFormSchema = z.object({
  shelters: z.array(shelterFormRowSchema),
});

export type ShelterFormRowState = z.infer<typeof shelterFormRowSchema>;
export type SheltersFormState = z.infer<typeof sheltersFormSchema>;
