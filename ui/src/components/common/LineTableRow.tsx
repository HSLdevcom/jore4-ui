import { gql } from '@apollo/client';
import { LineTableRowFragment } from '../../generated/graphql';
import {
  useAppDispatch,
  useAppSelector,
  useShowRoutesOnModal,
} from '../../hooks';
import {
  deselectRouteLabelsAction,
  selectExport,
  selectRouteLabelsAction,
} from '../../redux';
import { RouteLineTableRow } from './RouteLineTableRow';

interface Props {
  className?: string;
  line: LineTableRowFragment;
  isSelectable?: boolean;
}

const GQL_LINE_TABLE_ROW = gql`
  fragment line_table_row on route_line {
    name_i18n
    short_name_i18n
    priority
    ...line_information_for_map
    line_routes {
      ...route_information_for_map
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
  }
`;

/**
 * Reusable component LineTableRow for list views. This component requires
 * the line information (LineTableRowFragment) and linkTo parameter to
 * determine where we navigate after clicking this row.
 */
export const LineTableRow = ({
  className = '',
  line,
  isSelectable = false,
}: Props): JSX.Element => {
  const { showRouteOnMapByLineLabel } = useShowRoutesOnModal();
  const dispatch = useAppDispatch();
  const { selectedRouteLabels } = useAppSelector(selectExport);

  const showLineRoutes = () => {
    showRouteOnMapByLineLabel(line);
  };

  const onSelectChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.checked;
    const selectAction = selected
      ? selectRouteLabelsAction
      : deselectRouteLabelsAction;

    dispatch(selectAction(line.line_routes.map((route) => route.label)));
  };

  const hasRoutes = line.line_routes?.length > 0;

  // Entire line is selected for export if it has routes and each of those is selected.
  // Selecting only subset of routes shouldn't be possible, as user can select routes
  // from line list or from route list, not from both simultaneously.
  const isSelected =
    hasRoutes &&
    line.line_routes.every((route) =>
      selectedRouteLabels.includes(route.label),
    );

  // Check if any of the line's routes have any vehicle_journey's existing, which means
  // that the line has timetables.
  const hasTimetables = line.line_routes.some((route) =>
    route.route_journey_patterns.some((routeJourneyPattern) =>
      routeJourneyPattern.journey_pattern_refs.some(
        (journeyPatternRefs) => journeyPatternRefs.vehicle_journeys.length,
      ),
    ),
  );
  return (
    <RouteLineTableRow
      rowItem={line}
      hasTimetables={hasTimetables}
      onLocatorButtonClick={showLineRoutes}
      locatorButtonTestId="LineTableRow::showLineRoutes"
      className={className}
      lineId={line.line_id}
      onSelectChanged={isSelectable ? onSelectChanged : undefined}
      isSelected={isSelected}
      selectionDisabled={!hasRoutes}
    />
  );
};
