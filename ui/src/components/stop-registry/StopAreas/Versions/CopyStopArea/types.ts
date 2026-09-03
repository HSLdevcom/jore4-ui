import {
  QuayDetailsFragment,
  StopRegistryStopPlaceInput,
} from '../../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../../types';
import { InfoSpotInputHelper } from '../../../stops/stop-details/stop-version/types';
import { CutDirection } from '../CutStopAreaValidity';
import { StopAreaVersionFormState } from '../Types';

export type CopyStopAreaInputs = {
  readonly stopArea: EnrichedStopPlace;
  readonly state: StopAreaVersionFormState;
  readonly cutConfirmed: boolean;
};

export type StopRegistryStopAreaCopyInput = Omit<
  StopRegistryStopPlaceInput,
  'id'
>;

export type BidirectionalQuayMap = {
  readonly copiedQuays: ReadonlyMap<string, QuayDetailsFragment>;
  readonly originalQuays: ReadonlyMap<string, QuayDetailsFragment>;
};

export type InfoSpotInput = {
  readonly quayId: string;
  readonly infoSpots: ReadonlyArray<InfoSpotInputHelper>;
};

export type CopyStopAreaCutConfirmationModalState = {
  readonly currentVersion: {
    readonly start: string;
    readonly end: string | null;
    readonly cutDirection: CutDirection;
  };
  readonly newVersion: {
    readonly start: string;
    readonly end: string | null;
  };
};
