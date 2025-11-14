import { FC } from 'react';
import { StopPlaceSearchResults } from '../components/StopPlaceSharedComponents/StopPlaceSearchResults';
import { SortStopsBy } from '../types';
import { TerminalHeader } from './TerminalHeader';
import { TerminalSearchNoStops } from './TerminalSearchNoStops';

export const TerminalSearchResults: FC = () => {
  return (
    <StopPlaceSearchResults
      groupingField={SortStopsBy.BY_TERMINAL}
      placeType="terminal"
      translationLabel="stopRegistrySearch.terminals"
      HeaderComponent={TerminalHeader}
      NoStopsComponent={TerminalSearchNoStops}
    />
  );
};
