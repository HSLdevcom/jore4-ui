import {
  InfoSpotDetailsFragment,
  QuayDetailsFragment,
  ScheduledStopPointDetailFieldsFragment,
  StopPlaceDetailsFragment,
  StopRegistryAccessibilityLevel,
} from '../generated/graphql';
import { StopPlaceState } from './stop-registry';

export type StopPlaceEnrichmentProperties = {
  readonly nameSwe?: string | undefined;
  readonly nameEng?: string | undefined;
  readonly nameLongFin?: string | undefined;
  readonly nameLongSwe?: string | undefined;
  readonly nameLongEng?: string | undefined;
  readonly abbreviationFin?: string | undefined;
  readonly abbreviationSwe?: string | undefined;
  readonly abbreviationEng?: string | undefined;
  readonly name?: string | undefined;
  readonly municipality?: string | undefined;
  readonly fareZone?: string | undefined;
  readonly locationLat?: number | undefined;
  readonly locationLong?: number | undefined;
  readonly validityStart?: string | undefined;
  readonly validityEnd?: string | undefined;
};

export type QuayEnrichmentProperties = {
  readonly elyNumber: string | null;
  readonly privateCode: string | null;
  readonly locationFin: string | null;
  readonly locationSwe: string | null;
  readonly streetAddress: string | null;
  readonly postalCode: string | null;
  readonly functionalArea: number | null;
  readonly stopState: StopPlaceState | null;
  readonly accessibilityLevel: StopRegistryAccessibilityLevel;
  readonly stopType: {
    readonly mainLine: boolean;
    readonly virtual: boolean;
    readonly interchange: boolean;
    readonly railReplacement: boolean;
  };
};

export type StopPlace = StopPlaceDetailsFragment;
export type StopPlaceInfoSpots = InfoSpotDetailsFragment;
export type EnrichedStopPlace = Omit<StopPlace, 'name'> &
  StopPlaceEnrichmentProperties;
export type Quay = QuayDetailsFragment;
export type EnrichedQuay = Quay & QuayEnrichmentProperties;

/** Gets the stop details, including the stop place, depending on query parameters. */
export type StopWithDetails = ScheduledStopPointDetailFieldsFragment & {
  stop_place: EnrichedStopPlace | null;
  quay: EnrichedQuay | null;
};
