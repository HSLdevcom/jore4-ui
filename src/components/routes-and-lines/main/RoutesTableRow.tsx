import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RouteRoute } from '../../../generated/graphql';
import { useShowRoutesOnModal } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToShortDate, MAX_DATE, MIN_DATE } from '../../../time';
import { LocatorButton } from '../../../uiComponents';

interface Props {
  className?: string;
  route: RouteRoute;
}

export const RoutesTableRow = ({ className, route }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { showRoutesOnModal } = useShowRoutesOnModal();

  return (
    <tbody>
      <tr className={`border ${className}`}>
        <td className="border-l-8 border-hsl-dark-green py-4 pl-16 pr-4 font-bold">
          <Link to={routeDetails[Path.lineDetails].getLink(route.on_line_id)}>
            <Row>
              <Column className="w-1/2">
                <p className="text-3xl">{route.label}</p>
                <p className="text-lg">{route.name_i18n?.fi_FI}</p>
              </Column>
              <Column className="w-1/2 text-right">
                <p className="text-lg font-bold">
                  {t('validity.validDuring', {
                    startDate: mapToShortDate(route.validity_start || MIN_DATE),
                    endDate: mapToShortDate(route.validity_end || MAX_DATE),
                  })}
                </p>
                <p className="text-lg">
                  !Muokattu dd.mm.yyyy hh:mm | S. Suunnittelija
                </p>
              </Column>
            </Row>
          </Link>
        </td>
        <td className="w-20 border text-center">
          <LocatorButton
            onClick={() =>
              showRoutesOnModal(
                [route.route_id],
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                route.validity_start!,
                route.validity_end,
              )
            }
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
