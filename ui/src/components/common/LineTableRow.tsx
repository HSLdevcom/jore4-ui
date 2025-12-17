import { gql } from '@apollo/client';
import { ChangeEventHandler, FC } from 'react';
import { LineTableRowFragment } from '../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deselectRowAction, selectExport, selectRowAction } from '../../redux';
import { routeHasTimetables } from '../../utils/route';
import { useShowRoutesOnMap } from './hooks/useShowRoutesOnMap';
import {
  RouteLineTableRow,
  RouteLineTableRowVariant,
} from './RouteLineTableRow';

type LineTableRowProps = {
  readonly className?: string;
  readonly line: LineTableRowFragment;
  readonly isSelectable?: boolean;
  readonly rowVariant: RouteLineTableRowVariant;
};

const GQL_LINE_TABLE_ROW = gql`
  fragment line_table_row on route_line {
    name_i18n
    short_name_i18n
    validity_start
    validity_end
    priority
    ...line_map_params
    line_routes {
      ...route_map_params
      unique_label
      direction
      route_journey_patterns {
        journey_pattern_id
        journey_pattern_refs {
          journey_pattern_ref_id
          vehicle_journeys {
            vehicle_journey_id
          }
        }
        scheduled_stop_point_in_journey_patterns {
          journey_pattern_id
          scheduled_stop_point_sequence
          is_used_as_timing_point
        }
      }
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
