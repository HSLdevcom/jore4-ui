import { StopTableRowFragment } from '../../../../generated/graphql';
import { StopPlaceSearchRowDetails } from './StopPlaceSearchRowDetails';

export type StopSearchRow = StopTableRowFragment & {
  stop_place: StopPlaceSearchRowDetails;
};
