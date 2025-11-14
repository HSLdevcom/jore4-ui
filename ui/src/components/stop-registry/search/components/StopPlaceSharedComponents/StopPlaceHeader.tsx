import { DateTime } from 'luxon';
import { FC } from 'react';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { PathValue, routeDetails } from '../../../../../router/routeDetails';
import { LocatorButton } from '../../../../../uiComponents';
import { none } from '../../../../../utils';
import { ResultSelection } from '../../types';
import { BatchUpdateSelection } from '../../utils';
import { SelectAllCheckbox } from '../SelectAllCheckbox';
import { ActionMenu } from './ActionMenu/ActionMenu';
import { OpenDetails } from './ActionMenu/OpenDetailsPage';
import { ShowOnMap } from './ActionMenu/ShowOnMap';
import { FindStopPlaceInfo } from './useFindStopPlaces';

const testIds = {
  stopAreaLabel: 'StopPlaceSearch::label',
  stopAreaLink: 'StopPlaceSearch::link',
  locatorButton: 'StopPlaceSearch::locatorButton',
  showOnMap: 'StopPlaceSearch::showOnMap',
  showStopPlaceDetails: 'StopPlaceSearch::showStopPlaceDetails',
  selectAllStopPlaceStops: (privateCode: string) =>
    `StopPlaceSearch::selectAll::${privateCode}`,
};

type ImplementationProps = {
  readonly colorClasses: string;
  readonly onShowOnMap: () => void;
  readonly path: PathValue;
  readonly linkTitle: string;
  readonly linkContent: string;
  readonly showOnMapTooltip: string;
  readonly menuShowDetails: string;
  readonly menuShowOnMap: string;
};

type StopPlaceHeaderContentProps = {
  readonly className?: string;
  readonly observationDate: DateTime;
  readonly implementationProps: ImplementationProps;
  readonly isRounded: boolean;
  readonly stopPlace: FindStopPlaceInfo;
};

const StopPlaceHeaderContent: FC<StopPlaceHeaderContentProps> = ({
  className,
  implementationProps,
  isRounded,
  observationDate,
  stopPlace,
}) => {
  return (
    <div
      className={twMerge(
        'flex items-center gap-4 rounded-t-xl border-x border-t p-4',
        isRounded ? 'rounded-b-xl border-b' : '',
        implementationProps.colorClasses,
        className,
      )}
    >
      <Link
        to={routeDetails[implementationProps.path].getLink(
          stopPlace.private_code,
          {
            observationDate,
          },
        )}
        data-testid={testIds.stopAreaLink}
        title={implementationProps.linkTitle}
      >
        <h3 data-testid={testIds.stopAreaLabel}>
          {implementationProps.linkContent}
        </h3>
      </Link>

      <div className="flex-grow" />

      <LocatorButton
        onClick={implementationProps.onShowOnMap}
        tooltipText={implementationProps.showOnMapTooltip}
        testId={testIds.locatorButton}
      />

      <ActionMenu>
        <OpenDetails
          details={implementationProps.path}
          observationDate={observationDate}
          privateCode={stopPlace.private_code}
          testId={testIds.showStopPlaceDetails}
          text={implementationProps.menuShowDetails}
        />
        <ShowOnMap
          onClick={implementationProps.onShowOnMap}
          testId={testIds.showOnMap}
          text={implementationProps.menuShowOnMap}
        />
      </ActionMenu>
    </div>
  );
};

function areAllAreaStopsSelected(
  selection: ResultSelection,
  stopIds: ReadonlyArray<string>,
) {
  if (selection.selectionState === 'ALL_SELECTED') {
    return true;
  }

  if (selection.selectionState === 'NONE_SELECTED') {
    return false;
  }

  if (stopIds.length === 0) {
    return false;
  }

  if (selection.included.length) {
    return stopIds.every((stopId) => selection.included.includes(stopId));
  }

  return none((stopId) => selection.excluded.includes(stopId), stopIds);
}

type SelectAllStopPlaceStopsProps = {
  readonly onBatchUpdateSelection: BatchUpdateSelection;
  readonly selection: ResultSelection;
  readonly stopIds: ReadonlyArray<string>;
  readonly stopPlace: FindStopPlaceInfo;
};

const SelectAllStopPlaceStops: FC<SelectAllStopPlaceStopsProps> = ({
  onBatchUpdateSelection,
  selection,
  stopIds,
  stopPlace,
}) => {
  const allSelected = areAllAreaStopsSelected(selection, stopIds);

  const onToggleSelectAll = () =>
    onBatchUpdateSelection((actualSelection) => {
      if (areAllAreaStopsSelected(actualSelection, stopIds)) {
        return { exclude: stopIds };
      }

      return { include: stopIds };
    });

  return (
    <SelectAllCheckbox
      className="ml-[1px]"
      allSelected={allSelected}
      onToggleSelectAll={onToggleSelectAll}
      testId={testIds.selectAllStopPlaceStops(
        stopPlace.private_code ?? stopPlace.id,
      )}
    />
  );
};

type StopPlaceHeaderProps = StopPlaceHeaderContentProps &
  SelectAllStopPlaceStopsProps;
export type StopPlaceHeaderPublicPropsProps = Omit<
  StopPlaceHeaderProps,
  'implementationProps'
>;

export const StopPlaceHeader: FC<StopPlaceHeaderProps> = ({
  className,
  implementationProps,
  observationDate,
  onBatchUpdateSelection,
  stopIds,
  stopPlace,
  selection,
  isRounded,
}) => {
  return (
    <div className={twMerge('flex items-center gap-5', className)}>
      <SelectAllStopPlaceStops
        onBatchUpdateSelection={onBatchUpdateSelection}
        selection={selection}
        stopIds={stopIds}
        stopPlace={stopPlace}
      />
      <StopPlaceHeaderContent
        className="flex-grow"
        implementationProps={implementationProps}
        isRounded={isRounded}
        observationDate={observationDate}
        stopPlace={stopPlace}
      />
    </div>
  );
};
