import { RouteAllFieldsFragment } from '../../../generated/graphql';
import { useShowRoutesOnModal } from '../../../hooks';
import { RouteLineTableRow } from './RouteLineTableRow';

interface Props {
  className?: string;
  route: RouteAllFieldsFragment;
}

export const RouteTableRow = ({
  className = '',
  route,
}: Props): JSX.Element => {
  const { showRouteOnMapByLabel } = useShowRoutesOnModal();

  const onClickShowRouteOnMap = () => {
    showRouteOnMapByLabel(route);
  };

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
    />
  );
};
