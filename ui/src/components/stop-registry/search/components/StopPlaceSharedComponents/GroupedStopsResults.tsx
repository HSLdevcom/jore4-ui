import { ComponentType, FC } from 'react';
import { TranslationKey } from '../../../../../i18n';
import { SortStopsBy } from '../../types';
import {
  useGroupedResultSelection,
  useStopSearchRouterState,
} from '../../utils';
import { GroupedCountAndSortingRow } from './StopPlaceCountAndSortingRow';
import { StopPlaceHeaderPublicPropsProps } from './StopPlaceHeader';
import { StopPlaceSelector } from './StopPlaceSelector';
import { StopsTable } from './StopsTable';
import { NoStopsComponentProps } from './types';
import { FindStopPlaceInfo } from './useFindStopPlaces';

type SearchGroupedStopsResultsProps = {
  readonly groupingField: SortStopsBy;
  readonly stopPlaces: ReadonlyArray<FindStopPlaceInfo>;
  readonly translationLabel: TranslationKey;
  readonly HeaderComponent: ComponentType<StopPlaceHeaderPublicPropsProps>;
  readonly NoStopsComponent: ComponentType<NoStopsComponentProps>;
};

export const SearchGroupedStopsResults: FC<SearchGroupedStopsResultsProps> = ({
  groupingField,
  stopPlaces,
  translationLabel,
  HeaderComponent,
  NoStopsComponent,
}) => {
  const {
    state: {
      filters: { observationDate },
    },
    historyState: { resultSelection, selectedGroups, knownStopIds },
  } = useStopSearchRouterState();

  const {
    onRegisterNewGroup,
    onBatchUpdateSelection,
    onToggleSelectAll,
    onToggleSelection,
  } = useGroupedResultSelection();

  return (
    <>
      <GroupedCountAndSortingRow
        allSelected={resultSelection.selectionState === 'ALL_SELECTED'}
        groupingField={groupingField}
        onToggleSelectAll={onToggleSelectAll}
        hasResults={selectedGroups.length > 0}
        resultCount={knownStopIds.ids.length}
        resultSelection={resultSelection}
      />

      <StopPlaceSelector
        className="mb-6"
        stopPlaces={stopPlaces}
        translationLabel={translationLabel}
      />

      {stopPlaces
        .filter((stopPlace) =>
          selectedGroups.includes(stopPlace.id.toString(10)),
        )
        .map((stopPlace) => (
          <StopsTable
            className="mb-6 last:mb-0"
            key={stopPlace.id}
            observationDate={observationDate}
            onBatchUpdateSelection={onBatchUpdateSelection}
            onRegisterNewGroup={onRegisterNewGroup}
            onToggleSelection={onToggleSelection}
            selection={resultSelection}
            stopPlace={stopPlace}
            HeaderComponent={HeaderComponent}
            NoStopsComponent={NoStopsComponent}
          />
        ))}
    </>
  );
};
