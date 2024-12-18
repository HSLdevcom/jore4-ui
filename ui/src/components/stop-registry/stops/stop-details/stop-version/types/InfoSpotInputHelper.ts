import {
  StopRegistryInfoSpotInput,
  StopRegistryShelterEquipmentInput,
} from '../../../../../../generated/graphql';

export type InfoSpotInputHelper = {
  readonly originalShelter: StopRegistryShelterEquipmentInput;
  readonly originalShelterIndex: number;
  readonly infoSpotInput: StopRegistryInfoSpotInput;
};
