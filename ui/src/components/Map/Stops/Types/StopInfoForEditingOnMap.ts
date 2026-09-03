import { StopInfoTimingPlaceInfoFragment } from '../../../../generated/graphql';
import { RequiredNonNullableKeys } from '../../../../types';
import { StopFormState } from '../../../forms/stop';

export type ExistingStopFormState = RequiredNonNullableKeys<
  StopFormState,
  | 'publicCode'
  | 'quayId'
  | 'stopId'
  | 'stopArea'
  | 'latitude'
  | 'longitude'
  | 'priority'
  | 'validityStart'
>;

export type StopInfoForEditingOnMap = {
  readonly formState: ExistingStopFormState;
  readonly timingPlaceInfo: StopInfoTimingPlaceInfoFragment | null;
  readonly closestPointOnInfraLink: GeoJSON.Point | null;
};
