import { gql } from '@apollo/client';
import { RouteTableRowFragment } from '../../generated/graphql';
import {
  useAppDispatch,
  useAppSelector,
  useShowRoutesOnModal,
} from '../../hooks';
import {
  deselectRouteLabelAction,
  selectExport,
  selectRouteLabelAction,
} from '../../redux';
import { routeHasTimetables } from '../../utils/route';
import {
  RouteLineTableRow,
  RouteLineTableRowVariant,
} from './RouteLineTableRow';

const GQL_ROUTE_TABLE_ROW = gql`
  fragment route_table_row on route_route {
    ...route_information_for_map
    name_i18n
    direction
    priority
    on_line_id
    route_journey_patterns {
      journey_pattern_id
      journey_pattern_refs {
        journey_pattern_ref_id
        vehicle_journeys {
          vehicle_journey_id
        }
      }
    }
  }
`;

interface Props {
  className?: string;
  route: RouteTableRowFragment;
  isSelectable?: boolean;
  rowVariant: RouteLineTableRowVariant;
}

/**
 * Reusable component RouteTableRow for list views. This component requires
 * the route information (RouteTableRowFragment) and linkTo parameter to
 * determine where we navigate after clicking this row.
 */
export const RouteTableRow = ({
  className = '',
  route,
  isSelectable = false,
  rowVariant,
}: Props): JSX.Element => {
  const { showRouteOnMap } = useShowRoutesOnModal();
  const dispatch = useAppDispatch();
  const { selectedRouteLabels } = useAppSelector(selectExport);

  const onClickShowRouteOnMap = () => {
    showRouteOnMap(route);
  };

  const onSelectChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.checked;
    const selectAction = selected
      ? selectRouteLabelAction
      : deselectRouteLabelAction;

    dispatch(selectAction(route.label));
  };

  const hasTimetables = routeHasTimetables(route);

  const isSelected = selectedRouteLabels.includes(route.label);
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
    />
  );
};
