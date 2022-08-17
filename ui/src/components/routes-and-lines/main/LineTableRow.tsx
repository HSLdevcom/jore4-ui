import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LineTableRowFragment } from '../../../generated/graphql';
import { useAlertsAndHighLights, useShowRoutesOnModal } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToShortDate, MAX_DATE, MIN_DATE } from '../../../time';
import { LocatorButton } from '../../../uiComponents';

interface Props {
  className?: string;
  line: LineTableRowFragment;
}

const GQL_LINE_TABLE_ROW = gql`
  fragment line_table_row on route_line {
    ...line_all_fields
    line_routes {
      route_id
    }
  }
`;

export const LineTableRow = ({ className = '', line }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { showRoutesOnModal } = useShowRoutesOnModal();

  const showLineRoutes = () => {
    const lineRouteIds = line.line_routes?.map((item) => item.route_id);

    showRoutesOnModal(
      lineRouteIds,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      line.validity_start!,
      line.validity_end,
    );
  };

  const { getAlertLevel, getAlertStyle } = useAlertsAndHighLights();
  const alertStyle = getAlertStyle(getAlertLevel(line));

  return (
    <tbody>
      <tr className={`border border-light-grey ${className}`}>
        <td className={`${alertStyle.listItemBorder || ''} w-20 p-4 align-top`}>
          {alertStyle.icon && <i className={`${alertStyle.icon} text-3xl`} />}
        </td>
        <td className="py-4">
          <Link to={routeDetails[Path.lineDetails].getLink(line.line_id)}>
            <Row className="items-center">
              <Column className="w-1/2 font-bold">
                <p className="text-3xl">{line.label}</p>
                <p>{line.name_i18n.fi_FI}</p>
              </Column>
              <Column className="w-1/2 text-right">
                <p className="font-bold">
                  {t('validity.validDuring', {
                    startDate: mapToShortDate(line.validity_start || MIN_DATE),
                    endDate: mapToShortDate(line.validity_end || MAX_DATE),
                  })}
                </p>
                <p>!Muokattu dd.mm.yyyy hh:mm | S. Suunnittelija</p>
              </Column>
            </Row>
          </Link>
        </td>
        <td className="w-20 p-6 align-middle">
          <LocatorButton
            onClick={showLineRoutes}
            testId="LineTableRow::showLineRoutes"
          />
        </td>
      </tr>
    </tbody>
  );
};
