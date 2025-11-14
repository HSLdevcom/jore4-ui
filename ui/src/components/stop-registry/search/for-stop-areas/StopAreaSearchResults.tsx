import { FC } from 'react';
import { StopPlaceSearchResults } from '../components/StopPlaceSharedComponents/StopPlaceSearchResults';
import { SortStopsBy } from '../types';
import { StopAreaHeader } from './StopAreaHeader';
import { StopAreaSearchNoStops } from './StopAreaSearchNoStops';

export const StopAreaSearchResults: FC = () => {
  return (
    <StopPlaceSearchResults
      groupingField={SortStopsBy.BY_STOP_AREA}
      placeType="area"
      translationLabel="stopRegistrySearch.stopAreas"
      HeaderComponent={StopAreaHeader}
      NoStopsComponent={StopAreaSearchNoStops}
    />
  );
};
