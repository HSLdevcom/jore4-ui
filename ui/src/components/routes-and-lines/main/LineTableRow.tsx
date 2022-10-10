import { gql } from '@apollo/client';
import { LineTableRowFragment } from '../../../generated/graphql';
import {
  useAppDispatch,
  useAppSelector,
  useShowRoutesOnModal,
} from '../../../hooks';
import {
  deselectRouteLabelsAction,
  selectExport,
  selectRouteLabelsAction,
} from '../../../redux';
import { RouteLineTableRow } from './RouteLineTableRow';

interface Props {
  className?: string;
  line: LineTableRowFragment;
  isSelectable: boolean;
}

const GQL_LINE_TABLE_ROW = gql`
  fragment line_table_row on route_line {
    ...line_all_fields
    line_routes {
      ...route_information_for_map
    }
  }
`;

export const LineTableRow = ({
  className = '',
  line,
  isSelectable,
}: Props): JSX.Element => {
  const { showRouteOnMapByLineLabel } = useShowRoutesOnModal();
  const dispatch = useAppDispatch();
  const { selectedRouteLabels } = useAppSelector(selectExport);

  const showLineRoutes = () => {
    showRouteOnMapByLineLabel(line);
  };

  const onSetSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.checked;
    const selectAction = selected
      ? selectRouteLabelsAction
      : deselectRouteLabelsAction;

    dispatch(selectAction(line.line_routes.map((route) => route.label)));
  };

  const hasRoutes = line.line_routes?.length > 0;

  /**
   * Entire line is selected for export, if it has routes
   * and all its routes are selected
   */
  const isSelected =
    hasRoutes &&
    line.line_routes.every((route) =>
      selectedRouteLabels.includes(route.label),
    );

  return (
    <RouteLineTableRow
      rowItem={line}
      lineId={line.line_id}
      onLocatorButtonClick={showLineRoutes}
      locatorButtonTestId="LineTableRow::showLineRoutes"
      className={className}
      onSelectChanged={isSelectable ? onSetSelected : undefined}
      isSelected={isSelected}
      selectionDisabled={!hasRoutes}
    />
  );
};
