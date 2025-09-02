import { Dispatch, SetStateAction } from 'react';
import { InfoSpotDetailsFragment } from '../../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { InfoContainerControls } from '../../../../../common';

export type SortField =
  | 'label'
  | 'stop'
  | 'shelter'
  | 'purpose'
  | 'size'
  | 'description';

export type SortDirection = 'asc' | 'desc';

export type SortConfig = {
  readonly field: SortField | null;
  readonly direction: SortDirection;
};

export type TerminalInfoSpotsViewListProps = {
  readonly infoSpots: ReadonlyArray<InfoSpotDetailsFragment>;
  readonly terminal: EnrichedParentStopPlace;
  readonly latestAdded?: string;
};

export type TerminalInfoSpotRowProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
  readonly index: number;
  readonly terminal: EnrichedParentStopPlace;
  readonly openByDefault?: boolean;
};

export type TerminalInfoSpotRowHeaderProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
  readonly index: number;
  readonly terminal: EnrichedParentStopPlace;
  readonly isOpen: boolean;
  readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
  readonly controls: InfoContainerControls;
  readonly ariaControls: string;
};

export type TerminalInfoSpotsViewCardProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
  readonly terminal: EnrichedParentStopPlace;
};

export type TerminalInfoSpotPosterDetailsProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
};

export type TerminalInfoSpotsSectionProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly infoSpots: ReadonlyArray<InfoSpotDetailsFragment>;
};
