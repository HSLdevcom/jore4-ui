import { FC } from 'react';
import { StopPlaceSearchResults } from '../Components/StopPlaceSharedComponents/StopPlaceSearchResults';
import { SortStopsBy } from '../Types';
import { TerminalHeader } from './TerminalHeader';
import { TerminalSearchNoStops } from './TerminalSearchNoStops';

export const TerminalSearchResults: FC = () => {
  return (
    <StopPlaceSearchResults
      groupingField={SortStopsBy.BY_TERMINAL}
      placeType="terminal"
      translationLabel={($) => $.stopRegistrySearch.terminals}
      HeaderComponent={TerminalHeader}
      NoStopsComponent={TerminalSearchNoStops}
    />
  );
};
