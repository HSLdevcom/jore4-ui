import { gql } from '@apollo/client';
import { RouteTableRowFragment } from '../../../generated/graphql';
import {
  useAppDispatch,
  useAppSelector,
  useShowRoutesOnModal,
} from '../../../hooks';
import {
  deselectRouteLabelAction,
  selectExport,
  selectRouteLabelAction,
} from '../../../redux';
import { RouteLineTableRow } from './RouteLineTableRow';

const GQL_ROUTE_TABLE_ROW = gql`
  fragment route_table_row on route_route {
    ...route_information_for_map
    name_i18n
    direction
    priority
    on_line_id
  }
`;

interface Props {
  className?: string;
  route: RouteTableRowFragment;
  isSelectable?: boolean;
}

export const RouteTableRow = ({
  className = '',
  route,
  isSelectable = false,
}: Props): JSX.Element => {
  const { showRouteOnMapByLabel } = useShowRoutesOnModal();
  const dispatch = useAppDispatch();
  const { selectedRouteLabels } = useAppSelector(selectExport);

  const onClickShowRouteOnMap = () => {
    showRouteOnMapByLabel(route);
  };

  const onSelectChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.checked;
    const selectAction = selected
      ? selectRouteLabelAction
      : deselectRouteLabelAction;

    dispatch(selectAction(route.label));
  };

  const isSelected = selectedRouteLabels.includes(route.label);

  return (
    <RouteLineTableRow
      rowItem={route}
      lineId={route.on_line_id}
      onLocatorButtonClick={
        route.route_shape /* some routes imported from jore3 are missing the geometry */
          ? onClickShowRouteOnMap
          : undefined
      }
      locatorButtonTestId="RouteTableRow::showRoute"
      className={className}
      isSelected={isSelected}
      onSelectChanged={isSelectable ? onSelectChanged : undefined}
    />
  );
};
