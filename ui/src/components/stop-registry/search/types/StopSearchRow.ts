import { StopTableRowFragment } from '../../../../generated/graphql';
import { StopPlaceSearchRowDetails } from './StopPlaceSearchRowDetails';

export type StopSearchRow = StopTableRowFragment & {
  readonly quay: StopPlaceSearchRowDetails;
};
