import { DateTime } from 'luxon';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { getGeometryPoint } from '../../../../utils';
import {
  LocatorActionButton,
  NonSelectableStopTableRowProps,
  OpenDetailsPage,
  SelectableStopTableRowProps,
  ShowOnMap,
  StopSearchRow,
  StopTableRow,
} from '../../components';
import { LocatableStop } from '../../types';
import { ResultSelection } from '../types';

const testIds = {
  table: 'StopSearchByStopResultList::table',
};

type StopSearchResultRowProps = {
  readonly observationDate: DateTime;
  readonly stop: StopSearchRow;
} & (SelectableStopTableRowProps | NonSelectableStopTableRowProps);

const StopSearchResultRow: FC<StopSearchResultRowProps> = ({
  isSelected,
  observationDate,
  onToggleSelection,
  selectable,
  stop,
}) => {
  const locatableStop: LocatableStop = {
    label: stop.publicCode,
    netexId: stop.netexId,
    location: getGeometryPoint(stop.location),
    priority: stop.priority,
    transportMode: stop.transportMode,
  };

  return (
    <StopTableRow
      actionButtons={<LocatorActionButton stop={locatableStop} />}
      menuItems={[
        <ShowOnMap key="showOnMap" stop={locatableStop} />,
        <OpenDetailsPage key="openDetails" stop={locatableStop} />,
      ]}
      observationDate={observationDate}
      stop={stop}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(selectable
        ? { isSelected, onToggleSelection, selectable }
        : ({} as NonSelectableStopTableRowProps))}
    />
  );
};

type StopSearchResultStopsTableProps = {
  readonly className?: string;
  readonly observationDate: DateTime;
  readonly stops: ReadonlyArray<StopSearchRow>;
};

type SelectableStopSearchResultStopsTableProps =
  StopSearchResultStopsTableProps & {
    readonly onToggleSelection: (rowId: string) => void;
    readonly selection: ResultSelection;
  };

export const SelectableStopSearchResultStopsTable: FC<
  SelectableStopSearchResultStopsTableProps
> = ({ className, observationDate, onToggleSelection, selection, stops }) => {
  const isSelected = (stop: StopSearchRow) => {
    if (selection.selectionState === 'ALL_SELECTED') {
      return true;
    }

    if (selection.selectionState === 'NONE_SELECTED') {
      return false;
    }

    if (selection.included.length) {
      return selection.included.includes(stop.netexId);
    }

    if (selection.excluded.length) {
      return !selection.excluded.includes(stop.netexId);
    }

    return false;
  };

  return (
    <div className={twMerge('@container w-full', className)}>
      <table
        className={twMerge('h-1 w-full border-r', className)}
        data-testid={testIds.table}
      >
        <tbody>
          {stops.map((stop: StopSearchRow) => (
            <StopSearchResultRow
              key={stop.id}
              isSelected={isSelected(stop)}
              observationDate={observationDate}
              onToggleSelection={onToggleSelection}
              selectable
              stop={stop}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
