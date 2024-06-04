import { z } from 'zod';
import {
  ShelterEquipmentDetailsFragment,
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
} from '../../../../../generated/graphql';
import {
  createNullableEnum,
  nullableBoolean,
  nullableNumber,
} from '../../../../forms/common';

const shelterSchema = z.object({
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
  shelters: z.array(shelterSchema),
});

export type ShelterState = z.infer<typeof shelterSchema>;
export type SheltersFormState = z.infer<typeof sheltersFormSchema>;

export const mapShelterDataToFormState = (
  shelter: ShelterEquipmentDetailsFragment,
): ShelterState => {
  return {
    shelterType: shelter.shelterType ?? null,
    shelterElectricity: shelter.shelterElectricity ?? null,
    shelterLighting: shelter.shelterLighting ?? null,
    shelterCondition: shelter.shelterCondition ?? null,
    timetableCabinets: shelter.timetableCabinets ?? null,
    trashCan: shelter.trashCan ?? null,
    shelterHasDisplay: shelter.shelterHasDisplay ?? null,
    bicycleParking: shelter.bicycleParking ?? null,
    leaningRail: shelter.leaningRail ?? null,
    outsideBench: shelter.outsideBench ?? null,
    shelterFasciaBoardTaping: shelter.shelterFasciaBoardTaping ?? null,
  };
};
