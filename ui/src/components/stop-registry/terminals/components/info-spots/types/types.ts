import { Dispatch, SetStateAction } from 'react';
import {
  EnrichedParentStopPlace,
  StopPlaceInfoSpots,
} from '../../../../../../types';
import { InfoContainerControls } from '../../../../../common/InfoContainer';

export type SortField =
  'label' | 'stop' | 'shelter' | 'intendedUser' | 'size' | 'description';

export type SortDirection = 'asc' | 'desc';

export type SortConfig = {
  readonly field: SortField | null;
  readonly direction: SortDirection;
};

export type TerminalInfoSpotsViewListProps = {
  readonly infoSpots: ReadonlyArray<StopPlaceInfoSpots>;
  readonly terminal: EnrichedParentStopPlace;
  readonly latestAdded?: string;
};

export type TerminalInfoSpotRowProps = {
  readonly infoSpot: StopPlaceInfoSpots;
  readonly index: number;
  readonly terminal: EnrichedParentStopPlace;
  readonly openByDefault?: boolean;
};

export type TerminalInfoSpotRowHeaderProps = {
  readonly infoSpot: StopPlaceInfoSpots;
  readonly index: number;
  readonly terminal: EnrichedParentStopPlace;
  readonly isOpen: boolean;
  readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
  readonly controls: InfoContainerControls;
  readonly ariaControls: string;
};

export type TerminalInfoSpotsViewCardProps = {
  readonly infoSpot: StopPlaceInfoSpots;
  readonly terminal: EnrichedParentStopPlace;
};

export type TerminalInfoSpotsSectionProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly infoSpots: ReadonlyArray<StopPlaceInfoSpots>;
};
