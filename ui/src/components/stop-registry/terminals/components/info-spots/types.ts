import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { EnrichedParentStopPlace, Point } from '../../../../../types';

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
  readonly location: Point;
  readonly terminal: EnrichedParentStopPlace;
};

export type TerminalInfoSpotRowProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
  readonly location: Point;
  readonly index: number;
  readonly terminal: EnrichedParentStopPlace;
};

export type TerminalInfoSpotsViewCardProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
  readonly location: Point;
};

export type TerminalInfoSpotPosterDetailsProps = {
  readonly infoSpot: InfoSpotDetailsFragment;
};

export type TerminalInfoSpotsSectionProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly infoSpots: ReadonlyArray<InfoSpotDetailsFragment>;
};
