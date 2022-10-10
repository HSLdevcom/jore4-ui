import { RouteAllFieldsFragment } from '../../../generated/graphql';
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

interface Props {
  className?: string;
  route: RouteAllFieldsFragment;
  isSelectable: boolean;
}

export const RouteTableRow = ({
  className = '',
  route,
  isSelectable,
}: Props): JSX.Element => {
  const { showRouteOnMapByLabel } = useShowRoutesOnModal();
  const dispatch = useAppDispatch();
  const { selectedRouteLabels } = useAppSelector(selectExport);

  const onClickShowRouteOnMap = () => {
    showRouteOnMapByLabel(route);
  };

  const onSetSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      onSelectChanged={isSelectable ? onSetSelected : undefined}
    />
  );
};
