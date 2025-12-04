import { DateTime } from 'luxon';
import { FC, ReactNode } from 'react';
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

type StopSearchResultStopsWrapperProps = {
  readonly className?: string;
  readonly children: ReactNode;
};

const StopSearchResultStopsWrapper: FC<StopSearchResultStopsWrapperProps> = ({
  className,
  children,
}) => (
  <table
    className={twMerge('h-1 w-full border-x border-x-light-grey', className)}
    data-testid={testIds.table}
  >
    <tbody>{children}</tbody>
  </table>
);

type StopSearchResultStopsTableProps = {
  readonly className?: string;
  readonly observationDate: DateTime;
  readonly stops: ReadonlyArray<StopSearchRow>;
};

export const StopSearchResultStopsTable: FC<
  StopSearchResultStopsTableProps
> = ({ className, observationDate, stops }) => {
  return (
    <StopSearchResultStopsWrapper className={className}>
      {stops.map((stop: StopSearchRow) => (
        <StopSearchResultRow
          key={stop.id}
          observationDate={observationDate}
          stop={stop}
        />
      ))}
    </StopSearchResultStopsWrapper>
  );
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
    <StopSearchResultStopsWrapper
      className={twMerge('border-x-0 border-r', className)}
    >
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
    </StopSearchResultStopsWrapper>
  );
};
