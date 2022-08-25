import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RouteAllFieldsFragment } from '../../../generated/graphql';
import { useAlertsAndHighLights, useShowRoutesOnModal } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToShortDate, MAX_DATE, MIN_DATE } from '../../../time';
import { LocatorButton } from '../../../uiComponents';

interface Props {
  className?: string;
  route: RouteAllFieldsFragment;
}

export const RoutesTableRow = ({
  className = '',
  route,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { showRouteOnMapByLabel } = useShowRoutesOnModal();

  const { getAlertLevel, getAlertStyle } = useAlertsAndHighLights();
  const alertStyle = getAlertStyle(getAlertLevel(route));

  const onClickShowRouteOnMap = () => {
    showRouteOnMapByLabel(route);
  };

  return (
    <tbody>
      <tr className={`border border-light-grey ${className}`}>
        <td className={`${alertStyle.listItemBorder || ''} w-20 p-4 align-top`}>
          {alertStyle.icon && <i className={`${alertStyle.icon} text-3xl`} />}
        </td>
        <td className="py-4">
          <Link to={routeDetails[Path.lineDetails].getLink(route.on_line_id)}>
            <Row className="items-center">
              <Column className="w-1/2 font-bold">
                <p className="text-2xl">{route.label}</p>
                <p>{route.name_i18n?.fi_FI}</p>
              </Column>
              <Column className="w-1/2 text-right">
                <p className="font-bold">
                  {t('validity.validDuring', {
                    startDate: mapToShortDate(route.validity_start || MIN_DATE),
                    endDate: mapToShortDate(route.validity_end || MAX_DATE),
                  })}
                </p>
                <p>!Muokattu dd.mm.yyyy hh:mm | S. Suunnittelija</p>
              </Column>
            </Row>
          </Link>
        </td>
        <td className="w-20 p-6 align-middle">
          <LocatorButton
            onClick={onClickShowRouteOnMap}
            disabled={
              !route.route_shape /* some routes imported from jore3 are missing the geometry */
            }
            testId="RoutesTableRow::showRoute"
          />
        </td>
      </tr>
    </tbody>
  );
};
