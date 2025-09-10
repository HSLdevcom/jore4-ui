import { StopRegistryStopPlaceInput } from '../../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../../types';
import { StopAreaVersionFormState } from '../types/StopAreaVersionSchema';

export type CopyStopAreaInputs = {
  readonly stopArea: EnrichedStopPlace;
  readonly state: StopAreaVersionFormState;
};

export type StopRegistryStopAreaCopyInput = Omit<
  StopRegistryStopPlaceInput,
  'id'
>;
