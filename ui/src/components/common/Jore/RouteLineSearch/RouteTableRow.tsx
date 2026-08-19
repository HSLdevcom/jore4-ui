import { gql } from '@apollo/client';
import { ChangeEventHandler, FC } from 'react';
import { RouteTableRowFragment } from '../../../../generated/graphql';
import {
  deselectRowAction,
  selectExport,
  selectRowAction,
  useAppDispatch,
  useAppSelector,
} from '../../../../redux';
import { useShowRoutesOnMap } from '../../hooks';
import { RouteLineTableRow } from './RouteLineTableRow';
import { RouteLineTableRowVariant } from './Types';
import { routeHasTimetables } from './Utils';

const GQL_ROUTE_TABLE_ROW = gql`
  fragment RouteTableRow on route_route {
    ...RouteMapParams
    ...LineRouteSearchRouteWithJourneyPatternDetails

    name_i18n
    direction
    priority
    on_line_id
    variant
    unique_label
    route_line {
      line_id
      primary_vehicle_mode
      type_of_line
    }
  }

  fragment LineRouteSearchRouteWithJourneyPatternDetails on route_route {
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
`;

type RouteTableRowProps = {
  readonly className?: string;
  readonly route: RouteTableRowFragment;
  readonly isSelectable?: boolean;
  readonly rowVariant: RouteLineTableRowVariant;
};

/**
 * Reusable component RouteTableRow for list views. This component requires
 * the route information (RouteTableRowFragment) and linkTo parameter to
 * determine where we navigate after clicking this row.
 */
export const RouteTableRow: FC<RouteTableRowProps> = ({
  className,
  route,
  isSelectable = false,
  rowVariant,
}) => {
  const { showRouteOnMap } = useShowRoutesOnMap();
  const dispatch = useAppDispatch();
  const { selectedRows } = useAppSelector(selectExport);

  const onClickShowRouteOnMap = () => {
    showRouteOnMap(route);
  };

  const onSelectChanged: ChangeEventHandler<HTMLInputElement> = (event) => {
    const selected = event.target.checked;
    const selectAction = selected ? selectRowAction : deselectRowAction;
    dispatch(selectAction(route.unique_label));
  };

  const hasTimetables = routeHasTimetables(route);
  const isSelected = selectedRows.includes(route.unique_label);

  return (
    <RouteLineTableRow
      rowItem={route}
      rowVariant={rowVariant}
      onLocatorButtonClick={
        route.route_shape /* some routes imported from jore3 are missing the geometry */
          ? onClickShowRouteOnMap
          : undefined
      }
      locatorButtonTestId="RouteTableRow::showRoute"
      className={className}
      lineId={route.on_line_id}
      isSelected={isSelected}
      hasTimetables={hasTimetables}
      onSelectChanged={isSelectable ? onSelectChanged : undefined}
      testId={route.unique_label}
    />
  );
};
