import {
  ScheduledStopPointDefaultFieldsFragment,
  ServicePatternScheduledStopPointInsertInput,
  StopRegistryQuayInput,
} from '../../../../generated/graphql';
import { OptionalKeys } from '../../../../types';

// The input does not need to contain all the fields
export type CreateStopPointInput = OptionalKeys<
  ServicePatternScheduledStopPointInsertInput,
  'direction' | 'located_on_infrastructure_link_id'
>;

export type CreateParams = {
  readonly stopPoint: CreateStopPointInput;
  readonly stopPlaceId: string;
  readonly quay: StopRegistryQuayInput;
};

export type CreateChanges = {
  readonly conflicts?: ReadonlyArray<ScheduledStopPointDefaultFieldsFragment>;
  readonly stopPoint: ServicePatternScheduledStopPointInsertInput;
  readonly stopPlaceId: string;
  readonly quay: StopRegistryQuayInput;
};
