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
  nullablePositiveNumber,
} from '../../../../forms/common';

const shelterSchema = z.object({
  shelterId: z.string().nullable(),
  shelterNumber: nullablePositiveNumber,
  shelterType: createNullableEnum<StopRegistryShelterType>(),
  shelterElectricity: createNullableEnum<StopRegistryShelterElectricity>(),
  shelterLighting: nullableBoolean,
  shelterCondition: createNullableEnum<StopRegistryShelterCondition>(),
  timetableCabinets: nullablePositiveNumber,
  trashCan: nullableBoolean,
  shelterHasDisplay: nullableBoolean,
  bicycleParking: nullableBoolean,
  leaningRail: nullableBoolean,
  outsideBench: nullableBoolean,
  shelterFasciaBoardTaping: nullableBoolean,
  shelterNetexId: z.string().nullable(),
  toBeDeleted: z.boolean(),
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
    shelterId: shelter.id ?? null,
    shelterNumber: shelter.shelterNumber ?? null,
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
    shelterNetexId: shelter.id ?? null,
    toBeDeleted: false,
  };
};
