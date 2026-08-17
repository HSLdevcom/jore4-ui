import { gql } from '@apollo/client';
import { ChangeEventHandler, FC } from 'react';
import { LineTableRowFragment } from '../../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  deselectRowAction,
  selectExport,
  selectRowAction,
} from '../../../redux';
import { useShowRoutesOnMap } from '../../common/hooks/useShowRoutesOnMap';
import { RouteLineTableRow } from './RouteLineTableRow';
import { RouteLineTableRowVariant } from './types';
import { routeHasTimetables } from './utils';

type LineTableRowProps = {
  readonly className?: string;
  readonly line: LineTableRowFragment;
  readonly isSelectable?: boolean;
  readonly rowVariant: RouteLineTableRowVariant;
};

const GQL_LINE_TABLE_ROW = gql`
  fragment LineTableRow on route_line {
    name_i18n
    short_name_i18n
    validity_start
    validity_end
    priority
    primary_vehicle_mode
    type_of_line
    ...LineMapParams
    line_routes {
      ...RouteMapParams
      ...LineRouteSearchRouteWithJourneyPatternDetails
      unique_label
      direction
    }
  }
`;

/**
 * Reusable component LineTableRow for list views. This component requires
 * the line information (LineTableRowFragment) and linkTo parameter to
 * determine where we navigate after clicking this row.
 */
export const LineTableRow: FC<LineTableRowProps> = ({
  className,
  line,
  isSelectable = false,
  rowVariant,
}) => {
  const { showRoutesOnMapByLineLabel } = useShowRoutesOnMap();
  const dispatch = useAppDispatch();
  const { selectedRows } = useAppSelector(selectExport);

  const showLineRoutes = () => {
    showRoutesOnMapByLineLabel(line);
  };

  const onSelectChanged: ChangeEventHandler<HTMLInputElement> = (event) => {
    const selected = event.target.checked;

    const selectAction = selected ? selectRowAction : deselectRowAction;

    dispatch(selectAction(line.label));
  };

  const hasRoutes = line.line_routes?.length > 0;

  // Entire line is selected for export if it has routes and each of those is selected.
  // Selecting only subset of routes shouldn't be possible, as user can select routes
  // from line list or from route list, not from both simultaneously.

  const isSelected = selectedRows.includes(line.label);

  // Check if any of the line's route has timetables existing
  const hasTimetables = line.line_routes.some(routeHasTimetables);

  return (
    <RouteLineTableRow
      rowItem={line}
      rowVariant={rowVariant}
      hasTimetables={hasTimetables}
      onLocatorButtonClick={showLineRoutes}
      locatorButtonTestId="LineTableRow::showLineRoutes"
      className={className}
      lineId={line.line_id}
      onSelectChanged={isSelectable ? onSelectChanged : undefined}
      isSelected={isSelected}
      selectionDisabled={!hasRoutes}
      testId={line.label}
    />
  );
};
